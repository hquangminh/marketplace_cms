import { useState } from 'react';

import { Col, Row, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { EditOutlined } from '@ant-design/icons';
import Excel from 'exceljs';
import moment, { Moment } from 'moment';

import { formatNumber, onCheckErrorApiMessage } from 'common/functions';

import withdrawServices, { BodyFilterWithdraw } from 'services/withdraw-services';

import ModalUpdate from '../Update';
import TableCustom from 'components/fragments/TableCustom';

import { WithdrawModel, WithDrawCreateComponentProps } from 'models/withdraw.model';
import { SearchModel } from 'models/table.model';

import { Container } from 'styles/__styles';
import * as L from './style';

const WithDrawListComponent = (props: WithDrawCreateComponentProps) => {
  const [state, setState] = useState<{ withdraw?: WithdrawModel; isShowModal: boolean }>({
    isShowModal: false,
  });

  const columns: ColumnsType<WithdrawModel> = [
    {
      key: 'order_no',
      title: 'Number ID',
      dataIndex: 'order_no',
    },
    {
      title: 'Account name',
      dataIndex: 'account_name',
      key: 'account_name',
    },
    {
      key: 'amount',
      title: 'Amount',
      dataIndex: 'amount',
      render: (value) => formatNumber(value, '$'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (value) => (
        <>
          {value === 1 && (
            <Tag className='status status-1' color='success'>
              Success
            </Tag>
          )}
          {value === 2 && (
            <Tag className='status status-2' color='error'>
              Unsuccessful
            </Tag>
          )}
          {value === 3 && (
            <Tag className='status status-3' color='warning'>
              Wait for confirmation
            </Tag>
          )}
        </>
      ),
    },
    {
      title: 'Date request',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => moment(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Date update',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (value) => (value ? moment(value).format('DD/MM/YYYY') : null),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <EditOutlined
          onClick={() =>
            setState({
              withdraw: record,
              isShowModal: true,
            })
          }
        />
      ),
    },
  ];

  const handleExportExcel = async () => {
    const workSheetName = 'Data Withdraw';
    const workbook = new Excel.Workbook();
    const headers = [
      { header: 'Number Id', key: 'order_no', width: 20, horizontal: 'left' },
      { header: 'Date Request	', key: 'createdAt', width: 25, horizontal: 'left' },
      { header: 'Date Update	', key: 'updatedAt', width: 25, horizontal: 'left' },
      { header: 'Account Name', key: 'account_name', width: 20, horizontal: 'left' },
      { header: 'Card Number', key: 'card_number', width: 20, horizontal: 'left' },
      { header: 'Swift Code', key: 'swift_code', width: 20, horizontal: 'left' },
      { header: 'Bank Name', key: 'bank_name', width: 20, horizontal: 'left' },
      { header: 'Amount', key: 'amount', width: 20, style: { numFmt: '#,##0.00' } },
      { header: 'Email', key: 'email', width: 40, horizontal: 'left' },
      { header: 'Status', key: 'status', width: 20, horizontal: 'left' },
      { header: 'Transaction Id', key: 'transaction_id', width: 25, horizontal: 'left' },
      { header: 'Reason', key: 'reason', width: 25, horizontal: 'left' },
    ];

    try {
      const number = 2147483647;
      const body: BodyFilterWithdraw = {
        start_date: props.filter.start_date ?? moment().add(-30, 'days').format(),
        end_date: props.filter.end_date ?? moment().format(),
        status: props.filter.status || undefined,
      };

      const newData = await withdrawServices.postListWithdraw(number, 0, body);

      const worksheet = workbook.addWorksheet(workSheetName);
      worksheet.columns = headers;

      // worksheet.getColumn(7).alignment = { horizontal: 'right', indent: 2 };
      worksheet.getColumn(8).alignment = { horizontal: 'right' };
      worksheet.getCell('G1').alignment = { horizontal: 'left' };
      worksheet.mergeCells('A1', 'L1');
      worksheet.mergeCells('A2', 'L2');
      worksheet.mergeCells('A3', 'L3');
      worksheet.mergeCells('A4', 'L4');

      worksheet.getCell('C1').value = 'Withdrawal Request List';
      worksheet.getCell('C4').value = `Date & Time Export: ${moment().format(
        'DD/MM/YYYY, hh:mm a'
      )}`;
      worksheet.getRow(1).font = { bold: true, size: 20 };
      worksheet.getRow(2).font = { size: 14 };
      worksheet.getRow(3).font = { size: 14 };
      worksheet.getRow(4).font = { size: 14 };
      worksheet.getRow(6).font = { bold: true, size: 12 };
      worksheet.getRow(6).values = [
        'Number Id',
        'Date Request',
        'Date Update',
        'Account Name',
        'Card Number',
        'Swift Code',
        'Bank Name',
        'Amount',
        'Email',
        'Status',
        'Transaction Id',
        'Reason',
      ];
      newData.data?.map((dataExport: any) => {
        let labelStatus = '';
        let formatDateRequest = '';
        let formatDateUpdate = '';

        if (dataExport.status === 1) {
          labelStatus = 'Success';
        } else if (dataExport.status === 2) {
          labelStatus = 'Unsuccessful';
        } else if (dataExport.status === 3) {
          labelStatus = 'Wait for confirmation';
        }
        if (dataExport.createdAt || dataExport.updatedAt) {
          formatDateRequest = moment(dataExport?.createdAt).isValid()
            ? moment(dataExport?.createdAt).format('DD/MM/YYYY, hh:mm:ss')
            : '';
          formatDateUpdate = moment(dataExport?.updatedAt).isValid()
            ? moment(dataExport?.updatedAt).format('DD/MM/YYYY, hh:mm:ss')
            : '';
        }
        worksheet.addRow({
          ...dataExport,
          email: dataExport.market_user.email,
          status: labelStatus,
          createdAt: formatDateRequest,
          updatedAt: formatDateUpdate,
        });
        worksheet.getCell('C2').value = `Date: ${moment(props.filter.start_date).format(
          'DD/MM/YYYY'
        )}  To: ${moment(props.filter.end_date).format('DD/MM/YYYY')}`;
        worksheet.getCell('C3').value = `Number of requests: ${newData.data?.length}`;
        if (!props.filter.start_date && !props.filter.end_date) {
          worksheet.getCell('C2').value = `Date: ${moment()
            .add(-30, 'days')
            .format('DD/MM/YYYY')}  To: ${moment().format('DD/MM/YYYY')}`;
        }
      });

      worksheet.eachRow({ includeEmpty: false }, (row: any) => {
        const currentCell = row._cells;

        currentCell.forEach((singleCell: any) => {
          const cellAddress = singleCell._address;

          worksheet.getCell(cellAddress).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      });

      worksheet.views = [{ state: 'frozen', ySplit: 6 }];

      const buf = await workbook.xlsx.writeBuffer();
      const url = window.URL.createObjectURL(new Blob([buf]));
      const link = document.createElement('a');
      link.href = url;

      const startDate = props.filter.start_date
        ? moment(props.filter.start_date)
        : moment().subtract(1, 'months');
      const endDate = props.filter.end_date ? moment(props.filter.end_date) : moment();

      const fileName = `request-withdraw_${startDate.format('DD.MM.YYYY')}-${endDate.format(
        'DD.MM.YYYY'
      )}.xlsx`;

      link.setAttribute('download', fileName);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      onCheckErrorApiMessage(error);
    } finally {
      workbook.removeWorksheet(workSheetName);
    }
  };

  const onChangeFilter = (key: string | undefined, value: number | [Moment, Moment] | null) => {
    if (key === 'date') {
      props.onChangeFilter((s) => ({
        ...s,
        page: 1,
        start_date: !value
          ? undefined
          : typeof value !== 'number'
          ? moment(value[0]).format()
          : s.start_date,
        end_date: !value
          ? undefined
          : typeof value !== 'number'
          ? moment(value[1]).format()
          : s.end_date,
      }));
    } else {
      props.onChangeFilter((s) => ({
        ...s,
        page: 1,
        status: typeof value === 'number' ? value : undefined,
      }));
    }
  };

  const searchColumn: Array<SearchModel> = [
    {
      key: 'date',
      title: 'Date Request',
      type: 'range-picker',
      blockDateFuture: true,
      width: { span: 24, xl: 10, sm: 12 },
      onChange: onChangeFilter,
    },
    {
      key: 'status',
      title: 'Status',
      placeholder: 'Please select status',
      type: 'select',
      width: { span: 24, xl: 10, sm: 12 },
      data: [
        { value: 0, label: 'ALL', title: 'ALL' },
        { value: 1, label: 'Success', title: 'Success' },
        { value: 2, label: 'Unsuccessful', title: 'Unsuccessful' },
        { value: 3, label: 'Wait for confirmation', title: 'Wait for confirmation' },
      ],
      onChange: onChangeFilter,
    },
    {
      title: 'Export Excel',
      type: 'button',
      wrapperClass: 'btn-export-excel',
      width: { span: 24, xl: 4, sm: 12 },
      onClick: handleExportExcel,
    },
  ];

  return (
    <L.WithDraw_wrapper>
      <Container>
        <TableCustom
          loading={props.loading}
          columns={columns}
          searchColumn={searchColumn}
          expandable={{
            expandedRowRender: (data: any) => (
              <div className='tableDrop'>
                <Row gutter={24} className='title_drop'>
                  <Col className='gutter-row mb-2' span={24}>
                    <p>
                      <b>Bank Name: </b>
                      <p className='Description_InfoBank'>{data?.bank_name} </p>
                    </p>
                  </Col>
                  <Col className='gutter-row mb-2' span={24}>
                    <p>
                      <b>Card Number:</b>
                      <p className='Description_InfoBank'>{data?.card_number}</p>
                    </p>
                  </Col>
                  <Col className='gutter-row' span={24}>
                    <p>
                      <b>Swift Code:</b> <p className='Description_InfoBank'>{data?.swift_code}</p>
                    </p>
                  </Col>
                </Row>
              </div>
            ),
          }}
          data={props.withdraws || undefined}
          rowKey='id'
          width={800}
          isPagination={props.total > props.pageSize}
          page={props.page}
          total={props.total || 0}
          pageSize={props.pageSize}
          isChangePageSize
          onChangePage={(page) => props.onChangeFilter((f) => ({ ...f, page }))}
        />
      </Container>
      <ModalUpdate
        loading={props.loading}
        withdraw={state?.withdraw}
        onUpdate={props.onUpdate}
        isShowModal={state.isShowModal}
        onClose={() => setState({ withdraw: undefined, isShowModal: false })}
      />
    </L.WithDraw_wrapper>
  );
};

export default WithDrawListComponent;

import * as L from './style';

const LoadingChangeFragment = () => {
  return (
    <L.LoadingChange>
      <div className='overlay__wrapper' />
      <div className='loading__wrapper'>
        <div className='lds-facebook'>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </L.LoadingChange>
  );
};

export default LoadingChangeFragment;

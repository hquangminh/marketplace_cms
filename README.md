1. Đặt tên: đặt cho giống các file đã có, đừng làm khác đi (cái này không phải đúng sai, mà trong 1 nhóm thì mình phải thống nhất). Đặt tên trong page gồm cả 2 loại như userIssue, my-page là rất không ổn (2 file này cùng 1 người create :|
   )
2. Kiểu biến, hạn thế tối đa any --> kiểu object, array object thì hãy khai báo model cho nó, kiểu string thì khai báo là string

3. Đừng đặt tên biến state chung chung như "datasource". Đừng đặt tên sai mục đích, như dùng cho object issue thì đặt là issueList (bow)

4. Thứ tự import.

```
- import lib của react/redux
- import lib external
- import lib internal (trong foler common/hook/lib/config/...)
- import service
- import component
- import model
- import css/static
```

5. Hãy resolve tất cả các lỗi của console (browser).

6. Đừng để import thừa, biến thừa, function thừa

7. Thứ tự CSS

```
div {
    // block
    display
    width
    height
    padding top => bottom => left => right
    margin top => bottom => left => right

    // position
    position
    top
    bottom
    left
    right
}

```

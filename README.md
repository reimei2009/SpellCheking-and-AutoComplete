# SpellChecking and AutoComplete

**SpellChecking and AutoComplete** : kiểm tra chính tả và gợi ý từ tiếng Việt, sử dụng các thuật toán như Levenshtein Distance (LD) và Ternary Search Tree (TST).

## Tính năng

- **Kiểm tra chính tả:** Phát hiện và gợi ý sửa lỗi chính tả cho văn bản tiếng Việt.
- **Tự động hoàn thành:** Gợi ý từ dựa trên tiền tố nhập vào.
- **Phát hiện ký tự lặp:** Nhận diện và sửa các từ có ký tự bị lặp lại bất thường.
- **So sánh thuật toán:** Cho phép người dùng trải nghiệm và so sánh hai thuật toán LD và TST.

## Cấu trúc thư mục

- `src/algorithms/`: Chứa các thuật toán xử lý (TST, Levenshtein Distance, ...).
- `src/components/`: Các thành phần React UI như SpellChecker, LDDemo, TSTDemo.
- `src/utils/`: Các hàm tiện ích (xử lý CSV, pattern, ...).
- `public/`: Tài nguyên tĩnh, từ điển tiếng Việt.
- `images/`: Ảnh thành viên nhóm.

## Hướng dẫn chạy dự án

1. Cài đặt dependencies:
    ```sh
    npm install
    ```
2. Chạy ứng dụng:
    ```sh
    npm run dev
    ```





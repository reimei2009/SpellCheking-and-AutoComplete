import { useState } from 'react';

interface HelpGuideProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab?: 'TST' | 'LD' | 'Spell';
}

const HelpGuide: React.FC<HelpGuideProps> = ({ isOpen, onClose, activeTab = 'TST' }) => {
    const [currentTab, setCurrentTab] = useState(activeTab);

    if (!isOpen) return null;

    const guides = {
        TST: {
            title: 'Hướng dẫn sử dụng Ternary Search Tree',
            steps: [
                'Nhập từ vào ô tìm kiếm để bắt đầu',
                'Kết quả sẽ hiển thị các từ bắt đầu bằng chuỗi bạn nhập',
                'Điều chỉnh số lượng từ gợi ý bằng ô "Số lượng từ gợi ý"',
                'Click vào từ trong kết quả để sao chép'
            ]
        },
        LD: {
            title: 'Hướng dẫn sử dụng Levenshtein Distance',
            steps: [
                'Nhập từ gốc vào ô thứ nhất',
                'Nhập từ cần so sánh vào ô thứ hai',
                'Xem ma trận khoảng cách Levenshtein ở bên dưới',
                'Khoảng cách càng nhỏ, hai từ càng giống nhau',
                'Có thể điều chỉnh loại thuật toán (LD hoặc MLD)'
            ]
        },
        Spell: {
            title: 'Hướng dẫn Kiểm tra chính tả',
            steps: [
                'Nhập văn bản cần kiểm tra vào ô soạn thảo',
                'Từ sai chính tả sẽ được gạch chân màu đỏ',
                'Click vào từ gạch chân để xem gợi ý sửa',
                'Click vào từ gợi ý để thay thế từ sai',
                'Hệ thống tự động phát hiện từ lặp (ví dụ: "thìi" → "thì")'
            ]
        }
    };

    return (
        <div className="help-guide-overlay">
            <div className="help-guide-modal">
                <button className="close-button" onClick={onClose}>×</button>
                
                <div className="help-guide-tabs">
                    <button
                        className={currentTab === 'TST' ? 'active' : ''}
                        onClick={() => setCurrentTab('TST')}
                    >
                        Tìm kiếm TST
                    </button>
                    <button
                        className={currentTab === 'LD' ? 'active' : ''}
                        onClick={() => setCurrentTab('LD')}
                    >
                        Levenshtein Distance
                    </button>
                    <button
                        className={currentTab === 'Spell' ? 'active' : ''}
                        onClick={() => setCurrentTab('Spell')}
                    >
                        Kiểm tra chính tả
                    </button>
                </div>

                <div className="help-guide-content">
                    <h2>{guides[currentTab].title}</h2>
                    <ol className="help-steps">
                        {guides[currentTab].steps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>

                    {currentTab === 'TST' && (
                        <div className="help-example">
                            <h3>Ví dụ:</h3>
                            <p>Nhập "học" → Kết quả: học sinh, học tập, học vấn...</p>
                        </div>
                    )}

                    {currentTab === 'LD' && (
                        <div className="help-example">
                            <h3>Ví dụ:</h3>
                            <p>Từ 1: "học sinh" | Từ 2: "học sịnh"</p>
                            <p>Kết quả: Khoảng cách = 1 (thay đổi 1 ký tự)</p>
                        </div>
                    )}

                    {currentTab === 'Spell' && (
                        <div className="help-example">
                            <h3>Ví dụ:</h3>
                            <p>Nhập: "học sịnh" → Gợi ý: "học sinh"</p>
                            <p>Nhập: "thìii" → Gợi ý: "thì"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HelpGuide;

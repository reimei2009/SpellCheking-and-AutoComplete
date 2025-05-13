import { useState } from 'react';
import TeamMember from './TeamMember';

const Team = () => {
    const [showTeam, setShowTeam] = useState(false);

    const teamMembers = [
        {
            name: "Nguyễn Thị Huyền Sâm",
            role: "Trưởng nhóm",
            algorithm: "Levenshtein Distance",
            image: "NguyenThiHuyenSam.png",
            isLeader: true
        },
        {
            name: "Đoàn Phạm Ngọc Linh",
            role: "Thành viên",
            algorithm: "Ternary Search Tree",
            image: "DoanPhamNgocLinh.png"
        },
        {
            name: "Nguyễn Duy Vũ",
            role: "Thành viên",
            algorithm: "Ternary Search Tree",
            image: "NguyenDuyVu.png"
        },
        {
            name: "Ngô Thanh Tình",
            role: "Thành viên",
            algorithm: "Levenshtein Distance",
            image: "NgoThanhTinh.jpg"
        }
    ];

    return (
        <div className="team-section">
            <button 
                className="toggle-team-btn"
                onClick={() => setShowTeam(!showTeam)}
            >
                {showTeam ? 'Ẩn thông tin nhóm' : 'Nhóm 20'}
            </button>

            {showTeam && (
                <div className="team-container">
                    <h2 className="team-title">Nhóm 20</h2>
                    <div className="team-members">
                        {teamMembers.map((member, index) => (
                            <TeamMember
                                key={index}
                                {...member}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Team;

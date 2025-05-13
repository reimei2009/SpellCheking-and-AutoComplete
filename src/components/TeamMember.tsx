import { useState } from 'react';

interface TeamMemberProps {
    name: string;
    role: string;
    algorithm: string;
    image: string;
    isLeader?: boolean;
}

const TeamMember = ({ name, role, algorithm, image, isLeader }: TeamMemberProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className={`team-member ${isLeader ? 'leader' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="member-image-container">
                <img src={`/images/${image}`} alt={name} className="member-image" />
                <div className={`member-overlay ${isHovered ? 'visible' : ''}`}>
                    <p className="algorithm">{algorithm}</p>
                </div>
            </div>
            <div className="member-info">
                <h3>{name}</h3>
                <p className="role">{role}</p>
            </div>
        </div>
    );
};

export default TeamMember;

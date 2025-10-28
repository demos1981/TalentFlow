import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { Textarea } from '../UI/Textarea';
import { Select } from '../UI/Select';

const ProfileSettings: React.FC = () => {
  const [profile, setProfile] = useState({
    firstName: 'Дмитро',
    lastName: 'Сидоренко',
    email: 'dmitro@example.com',
    phone: '+380991234567',
    location: 'Київ, Україна',
    bio: 'Досвідчений HR менеджер з 5-річним стажем у сфері IT рекрутингу.',
    position: 'HR Manager',
    company: 'TechCorp Ukraine',
    experience: '5-10 років',
    education: 'Вища освіта',
    skills: ['Рекрутинг', 'HR менеджмент', 'Проведення інтерв\'ю', 'Оцінка кандидатів']
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Тут буде логіка збереження
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h3>Особиста інформація</h3>
        <p>Управління вашим профілем та особистою інформацією</p>
      </div>

      <div className="settings-form">
        <div className="form-row">
          <div className="form-group">
            <label>Ім'я</label>
            <Input
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              disabled={!isEditing}
              icon={<User size={16} />}
            />
          </div>
          <div className="form-group">
            <label>Прізвище</label>
            <Input
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              disabled={!isEditing}
              icon={<User size={16} />}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              disabled={!isEditing}
              icon={<Mail size={16} />}
            />
          </div>
          <div className="form-group">
            <label>Телефон</label>
            <Input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              disabled={!isEditing}
              icon={<Phone size={16} />}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Місцезнаходження</label>
          <Input
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            disabled={!isEditing}
            icon={<MapPin size={16} />}
          />
        </div>

        <div className="form-group">
          <label>Про себе</label>
          <Textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            disabled={!isEditing}
            rows={4}
            placeholder="Розкажіть про себе..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Посада</label>
            <Input
              value={profile.position}
              onChange={(e) => setProfile({ ...profile, position: e.target.value })}
              disabled={!isEditing}
              icon={<Briefcase size={16} />}
            />
          </div>
          <div className="form-group">
            <label>Компанія</label>
            <Input
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              disabled={!isEditing}
              icon={<Briefcase size={16} />}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Досвід роботи</label>
            <Select
              value={profile.experience}
              onChange={(value) => setProfile({ ...profile, experience: value })}
              disabled={!isEditing}
              options={[
                { value: '0-1 рік', label: '0-1 рік' },
                { value: '1-3 роки', label: '1-3 роки' },
                { value: '3-5 років', label: '3-5 років' },
                { value: '5-10 років', label: '5-10 років' },
                { value: '10+ років', label: '10+ років' }
              ]}
            />
          </div>
          <div className="form-group">
            <label>Освіта</label>
            <Select
              value={profile.education}
              onChange={(value) => setProfile({ ...profile, education: value })}
              disabled={!isEditing}
              options={[
                { value: 'Середня освіта', label: 'Середня освіта' },
                { value: 'Вища освіта', label: 'Вища освіта' },
                { value: 'Магістратура', label: 'Магістратура' },
                { value: 'Аспірантура', label: 'Аспірантура' }
              ]}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Навички</label>
          <div className="skills-tags">
            {profile.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
                {isEditing && (
                  <button
                    className="remove-skill"
                    onClick={() => {
                      const newSkills = profile.skills.filter((_, i) => i !== index);
                      setProfile({ ...profile, skills: newSkills });
                    }}
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
            {isEditing && (
              <button className="add-skill-btn">
                + Додати навичку
              </button>
            )}
          </div>
        </div>

        <div className="form-actions">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="primary">
              Редагувати профіль
            </Button>
          ) : (
            <div className="action-buttons">
              <Button onClick={handleSave} variant="primary">
                Зберегти зміни
              </Button>
              <Button onClick={handleCancel} variant="secondary">
                Скасувати
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;



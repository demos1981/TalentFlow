"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../stores/authStore";
import { useLanguageStore } from "../../../stores/languageStore";
import Layout from "../../../components/Layout/Layout";
import {
  Calendar,
  Clock,
  User,
  Video,
  Phone,
  MapPin,
  Plus,
  Save,
  X,
  Briefcase,
  Building,
  Mail,
  Phone as PhoneIcon,
  FileText,
  AlertCircle,
  CheckCircle,
  Users,
  Star,
} from "lucide-react";
import { interviewsApi } from "../../../services/api";
import "./new-interview.css";

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Job {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
  };
}

interface Interviewer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const NewInterviewPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    candidateId: "",
    jobId: "",
    interviewerId: "",
    scheduledDate: "",
    scheduledTime: "",
    duration: 60,
    type: "video" as
      | "video"
      | "phone"
      | "in-person"
      | "technical"
      | "behavioral"
      | "final"
      | "screening"
      | "panel",
    stage: "screening" as "screening" | "technical" | "final" | "offer",
    priority: "medium" as "low" | "medium" | "high",
    location: "",
    meetingLink: "",
    notes: "",
    tags: [] as string[],
    applicationId: "",
  });

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newTag, setNewTag] = useState("");

  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();

  // Load initial data
  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      // Load candidates, jobs, and interviewers
      // This would typically be API calls
      setCandidates([]);
      setJobs([]);
      setInterviewers([]);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const mapTypeToBackend = (
    type: typeof formData.type
  ):
    | "phone"
    | "video"
    | "onsite"
    | "technical"
    | "behavioral"
    | "final"
    | "screening"
    | "panel" => {
    if (type === "in-person") {
      return "onsite";
    }
    return type; // 'phone' | 'video' | 'technical' | 'behavioral' | 'final' | 'screening' | 'panel'
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (
        !formData.title ||
        !formData.scheduledDate ||
        !formData.scheduledTime
      ) {
        throw new Error(t("fillRequiredFields"));
      }
      if (!formData.applicationId) {
        // тимчасова перевірка, поки не додаси вибір application
        throw new Error("Application is required");
      }
      const scheduledIso = new Date(
        `${formData.scheduledDate}T${formData.scheduledTime}`
      ).toISOString();
      // Create interview data
      const interviewData = {
        // ✅ поля з CreateInterviewDto
        title: formData.title,
        applicationId: formData.applicationId, // 👈 ОБОВʼЯЗКОВО
        type: mapTypeToBackend(formData.type), // 👈 enum InterviewType
        scheduledDate: scheduledIso,
        duration: formData.duration, // number 15–480
        location: formData.location || undefined,
        meetingLink: formData.meetingLink || undefined,
        notes: formData.notes || undefined,
        interviewerIds: formData.interviewerId
          ? [formData.interviewerId]
          : undefined,
        isActive: true,
        metadata: {
          candidateId: formData.candidateId || null,
          jobId: formData.jobId || null,
          priority: formData.priority,
          stage: formData.stage,
          tags: formData.tags,
        },
      };

      // Create interview via API
      await interviewsApi.createInterview(interviewData);

      setSuccess(true);
      setTimeout(() => {
        router.push("/interviews");
      }, 2000);
    } catch (error: any) {
      console.error("Error creating interview:", error);
      setError(error.message || t("errorCreatingInterview"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/interviews");
  };

  if (success) {
    return (
      <Layout>
        <div className="new-interview-page">
          <div className="success-message">
            <CheckCircle className="success-icon" size={48} />
            <h2>{t("interviewCreatedSuccessfully")}</h2>
            <p>{t("redirectingToInterviews")}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="new-interview-page">
        {/* Header */}
        <div className="new-interview-header">
          <div className="header-content">
            <h1>{t("createInterview")}</h1>
            <p>{t("createInterviewDescription")}</p>
          </div>
        </div>

        {/* Form */}
        <form className="new-interview-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Basic Information */}
            <div className="form-section">
              <h3 className="section-title">
                <FileText className="icon" size={20} />
                {t("basicInformation")}
              </h3>

              <div className="form-group">
                <label className="form-label required">
                  {t("interviewTitle")}
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder={t("enterInterviewTitle")}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t("candidate")}</label>
                  <select
                    className="form-select"
                    value={formData.candidateId}
                    onChange={(e) =>
                      handleInputChange("candidateId", e.target.value)
                    }
                  >
                    <option value="">{t("selectCandidate")}</option>
                    {candidates.map((candidate) => (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.firstName} {candidate.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{t("job")}</label>
                  <select
                    className="form-select"
                    value={formData.jobId}
                    onChange={(e) => handleInputChange("jobId", e.target.value)}
                  >
                    <option value="">{t("selectJob")}</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} - {job.company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t("interviewer")}</label>
                <select
                  className="form-select"
                  value={formData.interviewerId}
                  onChange={(e) =>
                    handleInputChange("interviewerId", e.target.value)
                  }
                >
                  <option value="">{t("selectInterviewer")}</option>
                  {interviewers.map((interviewer) => (
                    <option key={interviewer.id} value={interviewer.id}>
                      {interviewer.firstName} {interviewer.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Schedule Information */}
            <div className="form-section">
              <h3 className="section-title">
                <Calendar className="icon" size={20} />
                {t("scheduleInformation")}
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label required">
                    {t("interviewDate")}
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.scheduledDate}
                    onChange={(e) =>
                      handleInputChange("scheduledDate", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">
                    {t("interviewTime")}
                  </label>
                  <input
                    type="time"
                    className="form-input"
                    value={formData.scheduledTime}
                    onChange={(e) =>
                      handleInputChange("scheduledTime", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    {t("duration")} ({t("minutes")})
                  </label>
                  <select
                    className="form-select"
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange("duration", parseInt(e.target.value))
                    }
                  >
                    <option value={30}>30 {t("minutes")}</option>
                    <option value={45}>45 {t("minutes")}</option>
                    <option value={60}>60 {t("minutes")}</option>
                    <option value={90}>90 {t("minutes")}</option>
                    <option value={120}>120 {t("minutes")}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{t("priority")}</label>
                  <select
                    className="form-select"
                    value={formData.priority}
                    onChange={(e) =>
                      handleInputChange("priority", e.target.value)
                    }
                  >
                    <option value="low">{t("low")}</option>
                    <option value="medium">{t("medium")}</option>
                    <option value="high">{t("high")}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Interview Details */}
            <div className="form-section">
              <h3 className="section-title">
                <Users className="icon" size={20} />
                {t("interviewDetails")}
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t("type")}</label>
                  <select
                    className="form-select"
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                  >
                    <option value="video">{t("video")}</option>
                    <option value="phone">{t("phone")}</option>
                    <option value="in-person">{t("inPerson")}</option>
                    <option value="technical">{t("technical")}</option>
                    <option value="behavioral">{t("behavioral")}</option>
                    <option value="screening">{t("screening")}</option>
                    <option value="final">{t("final")}</option>
                    <option value="panel">{t("panel")}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{t("stage")}</label>
                  <select
                    className="form-select"
                    value={formData.stage}
                    onChange={(e) => handleInputChange("stage", e.target.value)}
                  >
                    <option value="screening">{t("screening")}</option>
                    <option value="technical">{t("technical")}</option>
                    <option value="final">{t("final")}</option>
                    <option value="offer">{t("offer")}</option>
                  </select>
                </div>
              </div>

              {formData.type === "in-person" && (
                <div className="form-group">
                  <label className="form-label">{t("location")}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder={t("enterLocation")}
                  />
                </div>
              )}

              {formData.type === "video" && (
                <div className="form-group">
                  <label className="form-label">{t("meetingLink")}</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.meetingLink}
                    onChange={(e) =>
                      handleInputChange("meetingLink", e.target.value)
                    }
                    placeholder={t("enterMeetingLink")}
                  />
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="form-section">
              <h3 className="section-title">
                <FileText className="icon" size={20} />
                {t("additionalInformation")}
              </h3>

              <div className="form-group">
                <label className="form-label">{t("notes")}</label>
                <textarea
                  className="form-textarea"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder={t("enterNotes")}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t("tags")}</label>
                <div className="tags-input">
                  <div className="tags-list">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                        <button
                          type="button"
                          className="tag-remove"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="tag-input-group">
                    <input
                      type="text"
                      className="form-input"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder={t("addTag")}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="add-tag-button"
                      onClick={handleAddTag}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <AlertCircle className="icon" size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="icon" size={16} />
              {t("cancel")}
            </button>
            <button type="submit" className="save-button" disabled={isLoading}>
              {isLoading ? (
                <div className="loading-spinner" />
              ) : (
                <Save className="icon" size={16} />
              )}
              {isLoading ? t("creating") : t("createInterview")}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NewInterviewPage;

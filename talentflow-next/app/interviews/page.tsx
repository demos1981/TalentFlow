"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/authStore";
import { useLanguageStore } from "../../stores/languageStore";
import Layout from "../../components/Layout/Layout";
import {
  MessageSquare,
  Clock,
  Calendar,
  User,
  Video,
  Phone,
  MapPin,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  CalendarDays,
  Briefcase,
  Mail,
  Download,
  Settings,
  FileText,
  UserCheck,
  Award,
} from "lucide-react";
import { interviewsApi } from "../../services/api";
import { Interview as BackendInterview } from "../../services/interviewService";
import "./interviews.css";

interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  jobTitle: string;
  company: string;
  interviewer: string;
  interviewerEmail: string;
  date: string;
  time: string;
  duration: number;
  type:
    | "video"
    | "phone"
    | "in-person"
    | "onsite"
    | "technical"
    | "behavioral"
    | "final"
    | "screening"
    | "panel";
  status:
    | "scheduled"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "rescheduled"
    | "no-show";
  location?: string;
  videoUrl?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  stage: "screening" | "technical" | "final" | "offer";
  priority: "low" | "medium" | "high";
  tags: string[];
}

interface InterviewStats {
  total: number;
  scheduled: number;
  completed: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

const InterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [interviewStats, setInterviewStats] = useState<InterviewStats>({
    total: 0,
    scheduled: 0,
    completed: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
  });
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();

  // Transform backend interview data to frontend format
  const transformBackendInterview = (
    backendInterview: BackendInterview
  ): Interview => {
    const scheduledDate = new Date(backendInterview.scheduledDate);
    const date = scheduledDate.toISOString().split("T")[0];
    const time = scheduledDate.toTimeString().slice(0, 5);

    // Map backend type to frontend type
    const typeMapping: { [key: string]: Interview["type"] } = {
      phone: "phone",
      video: "video",
      onsite: "in-person",
      technical: "technical",
      behavioral: "behavioral",
      final: "final",
      screening: "screening",
      panel: "panel",
    };

    // Map backend status to frontend status
    const statusMapping: { [key: string]: Interview["status"] } = {
      scheduled: "scheduled",
      "in-progress": "in-progress",
      completed: "completed",
      cancelled: "cancelled",
      rescheduled: "rescheduled",
      "no-show": "no-show",
    };

    // Determine stage based on type
    const stageMapping: { [key: string]: Interview["stage"] } = {
      screening: "screening",
      technical: "technical",
      final: "final",
      behavioral: "technical",
      panel: "final",
      phone: "screening",
      video: "technical",
      onsite: "final",
    };

    return {
      id: backendInterview.id,
      candidateName: backendInterview.application?.user
        ? `${backendInterview.application.user.firstName || ""} ${
            backendInterview.application.user.lastName || ""
          }`.trim()
        : "Кандидат не вказаний",
      candidateEmail: backendInterview.application?.user?.email || "",
      candidatePhone: backendInterview.application?.user?.phone || "",
      jobTitle:
        backendInterview.application?.job?.title ||
        backendInterview.title ||
        "Інтерв'ю",
      company:
        backendInterview.application?.job?.company?.name ||
        "Компанія не вказана",
      interviewer: backendInterview.interviewers?.[0]
        ? `${backendInterview.interviewers[0].firstName} ${backendInterview.interviewers[0].lastName}`
        : `${backendInterview.createdBy?.firstName || ""} ${
            backendInterview.createdBy?.lastName || ""
          }`,
      interviewerEmail:
        backendInterview.interviewers?.[0]?.email ||
        backendInterview.createdBy?.email ||
        "",
      date,
      time,
      duration: backendInterview.duration,
      type: typeMapping[backendInterview.type] || "video",
      status: statusMapping[backendInterview.status] || "scheduled",
      location: backendInterview.location,
      videoUrl: backendInterview.meetingLink,
      notes: backendInterview.notes,
      rating: backendInterview.overallRating,
      feedback: backendInterview.feedback,
      stage: stageMapping[backendInterview.type] || "technical",
      priority: backendInterview.overallRating
        ? backendInterview.overallRating >= 4
          ? "high"
          : backendInterview.overallRating >= 3
          ? "medium"
          : "low"
        : "medium",
      tags: [], // We'll need to get tags from job requirements or candidate skills
    };
  };

  // Load interviews and stats from API
  const loadInterviews = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if user is authenticated
      if (!user) {
        console.warn("User not authenticated, skipping interviews load");
        setInterviews([]);
        setIsLoading(false);
        return;
      }

      console.log("Loading interviews for user:", user.id);

      // Load interviews
      const interviewsResponse = await interviewsApi.getInterviews({
        search: searchQuery || undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        type: selectedType !== "all" ? selectedType : undefined,
        page: 1,
        limit: 50,
        sortBy: "scheduledDate",
        sortOrder: "ASC",
      });

      console.log("Interviews API Response:", interviewsResponse);
      console.log("Interviews data:", interviewsResponse.data);
      console.log("Interviews data.data:", interviewsResponse.data?.data);
      console.log(
        "Interviews data.data.interviews:",
        interviewsResponse.data?.data?.interviews
      );
      console.log(
        "Full response structure:",
        JSON.stringify(interviewsResponse.data, null, 2)
      );

      // Check if the response structure is correct
      const interviewsData = interviewsResponse.data?.data?.interviews;
      if (!interviewsData) {
        console.warn(
          "No interviews data found in response:",
          interviewsResponse
        );
        setInterviews([]);
      } else {
        console.log("Raw interviews data:", interviewsData);
        const transformedInterviews = interviewsData.map(
          transformBackendInterview
        );
        console.log("Transformed interviews:", transformedInterviews);
        setInterviews(transformedInterviews);
      }

      // Load stats
      const statsResponse = await interviewsApi.getStats();
      console.log("Stats API Response:", statsResponse);

      // Calculate today's interviews
      const today = new Date();
      const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

      const currentInterviews = interviewsData || [];
      const todayInterviews = currentInterviews.filter((interview: any) => {
        const interviewDate = new Date(interview.scheduledDate);
        return interviewDate >= todayStart && interviewDate < todayEnd;
      }).length;

      // Set stats with fallback values - check both possible response structures
      const statsData = statsResponse.data?.data;
      setInterviewStats({
        total: statsData?.totalInterviews || 0,
        scheduled:
          statsData?.interviewsByStatus?.find(
            (s: any) => s.status === "scheduled"
          )?.count || 0,
        completed: statsData?.completedInterviews || 0,
        today: todayInterviews,
        thisWeek: 0, // We'll calculate this if needed
        thisMonth: 0, // We'll calculate this if needed
      });
    } catch (error: any) {
      console.error("Error loading interviews:", error);
      console.error("Error details:", {
        message: error?.message,
        stack: error?.stack,
        response: error?.response?.data,
      });
      setError("Помилка завантаження інтерв'ю. Спробуйте пізніше.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load interviews on component mount and when filters change
  useEffect(() => {
    if (user) {
      loadInterviews();
    }
  }, [user]);

  // Reload interviews when filters change
  useEffect(() => {
    if (user) {
      const timeoutId = setTimeout(() => {
        loadInterviews();
      }, 300); // Debounce search

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, user]);

  const statuses = [
    { id: "all", name: t("allStatuses"), icon: <MessageSquare size={16} /> },
    { id: "scheduled", name: t("scheduled"), icon: <Clock size={16} /> },
    { id: "completed", name: t("completed"), icon: <CheckCircle size={16} /> },
    { id: "cancelled", name: t("cancelled"), icon: <XCircle size={16} /> },
    {
      id: "rescheduled",
      name: t("rescheduled"),
      icon: <AlertCircle size={16} />,
    },
    { id: "in-progress", name: t("inProgress"), icon: <Clock size={16} /> },
  ];

  const types = [
    { id: "all", name: t("allTypes") },
    { id: "phone", name: t("phone") },
    { id: "video", name: t("video") },
    { id: "in-person", name: t("inPerson") },
    { id: "technical", name: t("technical") },
    { id: "screening", name: t("screening") },
    { id: "final", name: t("final") },
  ];

  const stages = [
    { id: "all", name: t("allStages") },
    { id: "screening", name: t("screening") },
    { id: "technical", name: t("technical") },
    { id: "final", name: t("final") },
    { id: "offer", name: t("offer") },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "status-scheduled";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      case "rescheduled":
        return "status-rescheduled";
      case "in-progress":
        return "status-scheduled";
      case "no-show":
        return "status-cancelled";
      default:
        return "status-scheduled";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return t("scheduled");
      case "completed":
        return t("completed");
      case "cancelled":
        return t("cancelled");
      case "rescheduled":
        return t("rescheduled");
      case "in-progress":
        return t("inProgress");
      case "no-show":
        return t("noShow");
      default:
        return t("unknown");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="icon" size={16} />;
      case "phone":
        return <Phone className="icon" size={16} />;
      case "in-person":
        return <User className="icon" size={16} />;
      default:
        return <MessageSquare className="icon" size={16} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "priority-default";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return t("high");
      case "medium":
        return t("medium");
      case "low":
        return t("low");
      default:
        return t("unknown");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const handleViewInterview = (interviewId: string) => {
    router.push(`/interviews/${interviewId}`);
  };

  const handleEditInterview = (interviewId: string) => {
    router.push(`/interviews/${interviewId}/edit`);
  };

  const handleAddInterview = () => {
    router.push("/interviews/new");
  };

  const handleDeleteInterview = async (interviewId: string) => {
    if (window.confirm("Ви впевнені, що хочете видалити це інтерв'ю?")) {
      try {
        await interviewsApi.deleteInterview(interviewId);
        await loadInterviews(); // Reload the list
      } catch (error) {
        console.error("Error deleting interview:", error);
        alert("Помилка видалення інтерв'ю. Спробуйте пізніше.");
      }
    }
  };

  const handleUpdateStatus = async (interviewId: string, newStatus: string) => {
    try {
      await interviewsApi.updateStatus(interviewId, { status: newStatus });
      await loadInterviews(); // Reload the list
    } catch (error) {
      console.error("Error updating interview status:", error);
      alert("Помилка оновлення статусу. Спробуйте пізніше.");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="interviews-page">
          <div className="loading-spinner">{t("loading")}...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="interviews-page">
          <div
            className="error-message"
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#dc2626",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              margin: "20px",
            }}
          >
            <p>{error}</p>
            <button
              onClick={loadInterviews}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Спробувати знову
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="interviews-page">
        <div className="interviews-header">
          <div className="interviews-header-content">
            <h1>{t("interviews")}</h1>
            <p>{t("interviewPlanningAndManagement")}</p>
          </div>
          <button className="add-interview-btn" onClick={handleAddInterview}>
            <Plus className="icon" />
            {t("addInterview")}
          </button>
        </div>

        {/* Статистика */}
        <div className="interviews-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">
                <Calendar size={24} />
              </div>
              <div className="stat-content">
                <h3>{interviewStats.total}</h3>
                <p>{t("totalInterviews")}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon scheduled">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <h3>{interviewStats.scheduled}</h3>
                <p>{t("scheduled")}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon completed">
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <h3>{interviewStats.completed}</h3>
                <p>{t("completed")}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon today">
                <CalendarDays size={24} />
              </div>
              <div className="stat-content">
                <h3>{interviewStats.today}</h3>
                <p>{t("today")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Фільтри та пошук */}
        <div className="interviews-filters">
          <div className="filters-left">
            <div className="search-box">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                className="search-input"
                placeholder={t("searchCandidatesPositions")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="filters-right">
            <div className="filter-group">
              <label>{t("status")}:</label>
              <select
                className="filter-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>{t("type")}:</label>
              <select
                className="filter-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>{t("stage")}:</label>
              <select
                className="filter-select"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
              >
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="view-controls">
              <button
                className={`view-button ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                {t("list")}
              </button>
              <button
                className={`view-button ${
                  viewMode === "calendar" ? "active" : ""
                }`}
                onClick={() => setViewMode("calendar")}
              >
                {t("calendar")}
              </button>
            </div>
          </div>
        </div>

        {/* Список інтерв'ю */}
        <div className="interviews-list">
          {interviews.length === 0 ? (
            <div className="empty-state">
              <Calendar size={48} />
              <h3>{t("noInterviews")}</h3>
              <p>{t("noScheduledInterviews")}</p>
              <button
                className="add-interview-btn-plan"
                onClick={handleAddInterview}
              >
                <Plus className="icon" />
                {/* {t("addInterview")} */}
              </button>
            </div>
          ) : (
            interviews.map((interview) => (
              <div key={interview.id} className="interview-card">
                <div className="interview-header">
                  <div className="interview-info">
                    <h3>{interview.candidateName}</h3>
                    <p className="job-title">
                      {interview.jobTitle} • {interview.company}
                    </p>
                  </div>
                  <div className="interview-status">
                    <span
                      className={`status-badge ${getStatusColor(
                        interview.status
                      )}`}
                    >
                      {getStatusText(interview.status)}
                    </span>
                    <span
                      className={`priority-badge ${getPriorityColor(
                        interview.priority
                      )}`}
                    >
                      {getPriorityText(interview.priority)}
                    </span>
                  </div>
                </div>

                <div className="interview-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <Calendar className="icon" size={16} />
                      <span>{formatDate(interview.date)}</span>
                    </div>
                    <div className="detail-item">
                      <Clock className="icon" size={16} />
                      <span>
                        {formatTime(interview.time)} ({interview.duration} хв)
                      </span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-item">
                      {getTypeIcon(interview.type)}
                      <span>
                        {interview.type === "video"
                          ? t("video")
                          : interview.type === "phone"
                          ? t("phone")
                          : interview.type === "in-person"
                          ? t("inPerson")
                          : interview.type === "technical"
                          ? t("technical")
                          : interview.type === "behavioral"
                          ? t("behavioral")
                          : interview.type === "final"
                          ? t("final")
                          : interview.type === "screening"
                          ? t("screening")
                          : interview.type === "panel"
                          ? t("panel")
                          : interview.type}
                      </span>
                    </div>
                    <div className="detail-item">
                      <User className="icon" size={16} />
                      <span>{interview.interviewer}</span>
                    </div>
                  </div>
                  {interview.type === "in-person" && interview.location && (
                    <div className="detail-row">
                      <div className="detail-item">
                        <MapPin className="icon" size={16} />
                        <span>{interview.location}</span>
                      </div>
                    </div>
                  )}
                  {interview.type === "video" && interview.videoUrl && (
                    <div className="detail-row">
                      <div className="detail-item">
                        <Video className="icon" size={16} />
                        <a
                          href={interview.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="video-link"
                        >
                          {t("joinVideoCall")}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {interview.notes && (
                  <div className="interview-notes">
                    <p>{interview.notes}</p>
                  </div>
                )}

                {interview.tags.length > 0 && (
                  <div className="interview-tags">
                    {interview.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="interview-actions">
                  <button
                    className="action-button view"
                    onClick={() => handleViewInterview(interview.id)}
                  >
                    <Eye className="icon" size={16} />
                    <span>{t("viewInterview")}</span>
                  </button>
                  <button
                    className="action-button edit"
                    onClick={() => handleEditInterview(interview.id)}
                  >
                    <Edit className="icon" size={16} />
                    <span>{t("editInterview")}</span>
                  </button>
                  <button className="action-button notify">
                    <MessageSquare className="icon" size={16} />
                    <span>{t("notify")}</span>
                  </button>
                  <button className="action-button more">
                    <MoreHorizontal className="icon" size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default InterviewsPage;

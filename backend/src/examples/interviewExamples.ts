/**
 * Приклади використання Interview API
 */

export const interviewExamples = {
  // Отримання всіх інтерв'ю
  getAllInterviews: {
    method: 'GET',
    url: '/api/interviews?page=1&limit=10&status=scheduled',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Interviews retrieved successfully',
      data: {
        interviews: [
          {
            id: '1',
            title: 'Technical Interview - Frontend Developer',
            description: 'Technical assessment for frontend developer position',
            applicationId: 'app-1',
            createdById: 'user-1',
            type: 'technical',
            status: 'scheduled',
            result: null,
            scheduledDate: '2024-01-20T14:00:00.000Z',
            duration: 60,
            location: 'Office Building A, Room 101',
            meetingLink: 'https://meet.google.com/abc-def-ghi',
            notes: 'Focus on React and TypeScript',
            feedback: null,
            overallRating: null,
            technicalSkills: null,
            communicationSkills: null,
            culturalFit: null,
            wouldRecommend: null,
            nextSteps: null,
            reason: null,
            startedAt: null,
            completedAt: null,
            cancelledAt: null,
            cancellationReason: null,
            isActive: true,
            application: {
              id: 'app-1',
              job: {
                id: 'job-1',
                title: 'Frontend Developer',
                company: {
                  name: 'Tech Corp'
                }
              },
              candidate: {
                id: 'candidate-1',
                firstName: 'John',
                lastName: 'Doe'
              }
            },
            createdBy: {
              id: 'user-1',
              firstName: 'Jane',
              lastName: 'Smith'
            },
            interviewers: [
              {
                id: 'user-2',
                firstName: 'Mike',
                lastName: 'Johnson'
              }
            ],
            createdAt: '2024-01-15T10:00:00.000Z',
            updatedAt: '2024-01-15T10:00:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }
    }
  },

  // Отримання інтерв'ю за ID
  getInterviewById: {
    method: 'GET',
    url: '/api/interviews/1',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Interview retrieved successfully',
      data: {
        id: '1',
        title: 'Technical Interview - Frontend Developer',
        description: 'Technical assessment for frontend developer position',
        applicationId: 'app-1',
        createdById: 'user-1',
        type: 'technical',
        status: 'scheduled',
        result: null,
        scheduledDate: '2024-01-20T14:00:00.000Z',
        duration: 60,
        location: 'Office Building A, Room 101',
        meetingLink: 'https://meet.google.com/abc-def-ghi',
        notes: 'Focus on React and TypeScript',
        feedback: null,
        overallRating: null,
        technicalSkills: null,
        communicationSkills: null,
        culturalFit: null,
        wouldRecommend: null,
        nextSteps: null,
        reason: null,
        startedAt: null,
        completedAt: null,
        cancelledAt: null,
        cancellationReason: null,
        isActive: true,
        application: {
          id: 'app-1',
          job: {
            id: 'job-1',
            title: 'Frontend Developer',
            company: {
              name: 'Tech Corp'
            }
          },
          candidate: {
            id: 'candidate-1',
            firstName: 'John',
            lastName: 'Doe'
          }
        },
        createdBy: {
          id: 'user-1',
          firstName: 'Jane',
          lastName: 'Smith'
        },
        interviewers: [
          {
            id: 'user-2',
            firstName: 'Mike',
            lastName: 'Johnson'
          }
        ],
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z'
      }
    }
  },

  // Створення інтерв'ю
  createInterview: {
    method: 'POST',
    url: '/api/interviews',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      title: 'Final Interview - Senior Developer',
      description: 'Final round interview for senior developer position',
      applicationId: 'app-2',
      type: 'final',
      status: 'scheduled',
      scheduledDate: '2024-01-25T15:00:00.000Z',
      duration: 90,
      location: 'Conference Room B',
      meetingLink: 'https://meet.google.com/xyz-123-abc',
      notes: 'Final assessment with CTO',
      interviewerIds: ['user-3', 'user-4'],
      isActive: true
    },
    response: {
      success: true,
      message: 'Interview created successfully',
      data: {
        id: '2',
        title: 'Final Interview - Senior Developer',
        description: 'Final round interview for senior developer position',
        applicationId: 'app-2',
        createdById: 'user-1',
        type: 'final',
        status: 'scheduled',
        result: null,
        scheduledDate: '2024-01-25T15:00:00.000Z',
        duration: 90,
        location: 'Conference Room B',
        meetingLink: 'https://meet.google.com/xyz-123-abc',
        notes: 'Final assessment with CTO',
        feedback: null,
        overallRating: null,
        technicalSkills: null,
        communicationSkills: null,
        culturalFit: null,
        wouldRecommend: null,
        nextSteps: null,
        reason: null,
        startedAt: null,
        completedAt: null,
        cancelledAt: null,
        cancellationReason: null,
        isActive: true,
        interviewers: [
          {
            id: 'user-3',
            firstName: 'Sarah',
            lastName: 'Wilson'
          },
          {
            id: 'user-4',
            firstName: 'David',
            lastName: 'Brown'
          }
        ],
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z'
      }
    }
  },

  // Оновлення інтерв'ю
  updateInterview: {
    method: 'PUT',
    url: '/api/interviews/1',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      title: 'Technical Interview - Frontend Developer (Updated)',
      description: 'Updated technical assessment for frontend developer position',
      duration: 90,
      location: 'Office Building A, Room 201',
      notes: 'Updated focus on React, TypeScript, and testing'
    },
    response: {
      success: true,
      message: 'Interview updated successfully',
      data: {
        id: '1',
        title: 'Technical Interview - Frontend Developer (Updated)',
        description: 'Updated technical assessment for frontend developer position',
        applicationId: 'app-1',
        createdById: 'user-1',
        type: 'technical',
        status: 'scheduled',
        result: null,
        scheduledDate: '2024-01-20T14:00:00.000Z',
        duration: 90,
        location: 'Office Building A, Room 201',
        meetingLink: 'https://meet.google.com/abc-def-ghi',
        notes: 'Updated focus on React, TypeScript, and testing',
        feedback: null,
        overallRating: null,
        technicalSkills: null,
        communicationSkills: null,
        culturalFit: null,
        wouldRecommend: null,
        nextSteps: null,
        reason: null,
        startedAt: null,
        completedAt: null,
        cancelledAt: null,
        cancellationReason: null,
        isActive: true,
        interviewers: [
          {
            id: 'user-2',
            firstName: 'Mike',
            lastName: 'Johnson'
          }
        ],
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T11:30:00.000Z'
      }
    }
  },

  // Додавання відгуку про інтерв'ю
  addInterviewFeedback: {
    method: 'POST',
    url: '/api/interviews/1/feedback',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      feedback: 'Excellent candidate with strong technical skills and good communication. Shows great potential.',
      overallRating: 4.5,
      technicalSkills: 4.5,
      communicationSkills: 4.0,
      culturalFit: 5.0,
      wouldRecommend: true,
      nextSteps: 'Proceed to final interview with CTO',
      result: 'passed'
    },
    response: {
      success: true,
      message: 'Interview feedback added successfully',
      data: {
        id: '1',
        title: 'Technical Interview - Frontend Developer',
        description: 'Technical assessment for frontend developer position',
        applicationId: 'app-1',
        createdById: 'user-1',
        type: 'technical',
        status: 'completed',
        result: 'passed',
        scheduledDate: '2024-01-20T14:00:00.000Z',
        duration: 60,
        location: 'Office Building A, Room 101',
        meetingLink: 'https://meet.google.com/abc-def-ghi',
        notes: 'Focus on React and TypeScript',
        feedback: 'Excellent candidate with strong technical skills and good communication. Shows great potential.',
        overallRating: 4.5,
        technicalSkills: 4.5,
        communicationSkills: 4.0,
        culturalFit: 5.0,
        wouldRecommend: true,
        nextSteps: 'Proceed to final interview with CTO',
        reason: null,
        startedAt: '2024-01-20T14:00:00.000Z',
        completedAt: '2024-01-20T15:00:00.000Z',
        cancelledAt: null,
        cancellationReason: null,
        isActive: true,
        interviewers: [
          {
            id: 'user-2',
            firstName: 'Mike',
            lastName: 'Johnson'
          }
        ],
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-20T15:00:00.000Z'
      }
    }
  },

  // Оновлення статусу інтерв'ю
  updateInterviewStatus: {
    method: 'PATCH',
    url: '/api/interviews/1/status',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      status: 'cancelled',
      reason: 'Candidate withdrew application',
      cancellationReason: 'Candidate found another position'
    },
    response: {
      success: true,
      message: 'Interview status updated successfully',
      data: {
        id: '1',
        title: 'Technical Interview - Frontend Developer',
        description: 'Technical assessment for frontend developer position',
        applicationId: 'app-1',
        createdById: 'user-1',
        type: 'technical',
        status: 'cancelled',
        result: null,
        scheduledDate: '2024-01-20T14:00:00.000Z',
        duration: 60,
        location: 'Office Building A, Room 101',
        meetingLink: 'https://meet.google.com/abc-def-ghi',
        notes: 'Focus on React and TypeScript',
        feedback: null,
        overallRating: null,
        technicalSkills: null,
        communicationSkills: null,
        culturalFit: null,
        wouldRecommend: null,
        nextSteps: null,
        reason: 'Candidate withdrew application',
        startedAt: null,
        completedAt: null,
        cancelledAt: '2024-01-18T10:00:00.000Z',
        cancellationReason: 'Candidate found another position',
        isActive: true,
        interviewers: [
          {
            id: 'user-2',
            firstName: 'Mike',
            lastName: 'Johnson'
          }
        ],
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-18T10:00:00.000Z'
      }
    }
  },

  // Отримання календаря інтерв'ю
  getInterviewCalendar: {
    method: 'GET',
    url: '/api/interviews/calendar/events?startDate=2024-01-01&endDate=2024-01-31',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Interview calendar retrieved successfully',
      data: [
        {
          id: '1',
          title: 'Technical Interview - Frontend Developer',
          type: 'technical',
          status: 'scheduled',
          scheduledDate: '2024-01-20T14:00:00.000Z',
          duration: 60,
          location: 'Office Building A, Room 101',
          application: {
            job: {
              title: 'Frontend Developer',
              company: {
                name: 'Tech Corp'
              }
            },
            candidate: {
              firstName: 'John',
              lastName: 'Doe'
            }
          }
        }
      ]
    }
  },

  // Отримання статистики інтерв'ю
  getInterviewStats: {
    method: 'GET',
    url: '/api/interviews/stats/overview?startDate=2024-01-01&endDate=2024-01-31',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Interview statistics retrieved successfully',
      data: {
        totalInterviews: 15,
        interviewsByStatus: [
          { status: 'scheduled', count: 5 },
          { status: 'completed', count: 8 },
          { status: 'cancelled', count: 2 }
        ],
        interviewsByType: [
          { type: 'technical', count: 6 },
          { type: 'behavioral', count: 4 },
          { type: 'final', count: 3 },
          { type: 'phone', count: 2 }
        ],
        interviewsByResult: [
          { result: 'passed', count: 5 },
          { result: 'failed', count: 2 },
          { result: 'pending', count: 1 }
        ],
        upcomingInterviews: 5,
        completedInterviews: 8,
        averageRating: 4.2,
        successRate: 71.4,
        timestamp: '2024-01-15T10:00:00.000Z'
      }
    }
  },

  // Видалення інтерв'ю
  deleteInterview: {
    method: 'DELETE',
    url: '/api/interviews/1',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: true,
      message: 'Interview deleted successfully'
    }
  },

  // Приклад помилки (інтерв'ю не знайдено)
  getInterviewByIdError: {
    method: 'GET',
    url: '/api/interviews/non-existent-id',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    response: {
      success: false,
      message: 'Interview not found'
    }
  },

  // Приклад помилки (неавторизований доступ)
  createInterviewError: {
    method: 'POST',
    url: '/api/interviews',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      title: 'Test Interview'
    },
    response: {
      success: false,
      message: 'Authorization required'
    }
  }
};

export default interviewExamples;



import { IsString, IsOptional, IsEnum, IsBoolean, IsEmail, IsUUID, IsObject } from 'class-validator';
import { CompanyUserRole, CompanyUserStatus } from '../models/CompanyUser';

// DTO для створення користувача компанії
export class CreateCompanyUserDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsEnum(CompanyUserRole)
  role?: CompanyUserRole;

  @IsOptional()
  @IsObject()
  permissions?: {
    canPublishJobsSelf?: boolean;
    canViewOthersJobs?: boolean;
    canManageOthersJobs?: boolean;
    canViewCandidateContacts?: boolean;
    canActivateServices?: boolean;
    canMakePayments?: boolean;
    canManageUsers?: boolean;
    canManagePaymentCards?: boolean;
    canEditCompanyInfo?: boolean;
    canManageJobTemplates?: boolean;
  };
}

// DTO для оновлення користувача компанії
export class UpdateCompanyUserDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsEnum(CompanyUserRole)
  role?: CompanyUserRole;

  @IsOptional()
  @IsEnum(CompanyUserStatus)
  status?: CompanyUserStatus;

  @IsOptional()
  @IsObject()
  permissions?: {
    canPublishJobsSelf?: boolean;
    canViewOthersJobs?: boolean;
    canManageOthersJobs?: boolean;
    canViewCandidateContacts?: boolean;
    canActivateServices?: boolean;
    canMakePayments?: boolean;
    canManageUsers?: boolean;
    canManagePaymentCards?: boolean;
    canEditCompanyInfo?: boolean;
    canManageJobTemplates?: boolean;
  };

  @IsOptional()
  @IsString()
  notes?: string;
}

// DTO для запрошення користувача
export class InviteCompanyUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(CompanyUserRole)
  role?: CompanyUserRole;

  @IsOptional()
  @IsObject()
  permissions?: {
    canPublishJobsSelf?: boolean;
    canViewOthersJobs?: boolean;
    canManageOthersJobs?: boolean;
    canViewCandidateContacts?: boolean;
    canActivateServices?: boolean;
    canMakePayments?: boolean;
    canManageUsers?: boolean;
    canManagePaymentCards?: boolean;
    canEditCompanyInfo?: boolean;
    canManageJobTemplates?: boolean;
  };
}

// DTO для пошуку користувачів компанії
export class SearchCompanyUsersDto {
  @IsOptional()
  @IsEnum(CompanyUserRole)
  role?: CompanyUserRole;

  @IsOptional()
  @IsEnum(CompanyUserStatus)
  status?: CompanyUserStatus;

  @IsOptional()
  @IsString()
  search?: string;
}

// DTO для оновлення прав
export class UpdatePermissionsDto {
  @IsObject()
  permissions: {
    canPublishJobsSelf?: boolean;
    canViewOthersJobs?: boolean;
    canManageOthersJobs?: boolean;
    canViewCandidateContacts?: boolean;
    canActivateServices?: boolean;
    canMakePayments?: boolean;
    canManageUsers?: boolean;
    canManagePaymentCards?: boolean;
    canEditCompanyInfo?: boolean;
    canManageJobTemplates?: boolean;
  };
}


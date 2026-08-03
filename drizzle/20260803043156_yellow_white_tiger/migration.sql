CREATE TYPE "role_code" AS ENUM('ADMIN', 'FLEET_MANAGER', 'DISPATCHER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST', 'MECHANIC');--> statement-breakpoint
CREATE TYPE "user_status" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'INVITED');--> statement-breakpoint
CREATE TYPE "fuel_type" AS ENUM('DIESEL', 'PETROL', 'CNG', 'ELECTRIC', 'HYBRID');--> statement-breakpoint
CREATE TYPE "vehicle_assignment_status" AS ENUM('ACTIVE', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "vehicle_assignment_type" AS ENUM('PERMANENT', 'TEMPORARY', 'TRIP_SPECIFIC');--> statement-breakpoint
CREATE TYPE "vehicle_doc_type" AS ENUM('REGISTRATION_CERTIFICATE', 'INSURANCE', 'FITNESS_CERTIFICATE', 'POLLUTION_CERTIFICATE', 'ROAD_PERMIT', 'TAX_RECEIPT', 'OTHER');--> statement-breakpoint
CREATE TYPE "vehicle_status" AS ENUM('AVAILABLE', 'ASSIGNED', 'IN_TRANSIT', 'MAINTENANCE', 'OUT_OF_SERVICE', 'RETIRED');--> statement-breakpoint
CREATE TYPE "vehicle_type" AS ENUM('TRUCK', 'VAN', 'BUS', 'CAR', 'TRAILER', 'TANKER', 'PICKUP', 'OTHER');--> statement-breakpoint
CREATE TYPE "driver_availability_status" AS ENUM('AVAILABLE', 'ASSIGNED', 'DRIVING', 'OFF_DUTY', 'ON_LEAVE');--> statement-breakpoint
CREATE TYPE "driver_doc_type" AS ENUM('REGISTRATION_CERTIFICATE', 'INSURANCE', 'FITNESS_CERTIFICATE', 'POLLUTION_CERTIFICATE', 'ROAD_PERMIT', 'TAX_RECEIPT', 'ID_PROOF', 'MEDICAL_CERTIFICATE', 'OTHER');--> statement-breakpoint
CREATE TYPE "employment_status" AS ENUM('ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED');--> statement-breakpoint
CREATE TYPE "verification_status" AS ENUM('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "event_severity" AS ENUM('INFO', 'WARNING', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "event_type" AS ENUM('TRIP_STARTED', 'TRIP_COMPLETED', 'VEHICLE_BREAKDOWN', 'ACCIDENT', 'HARSH_BRAKING', 'SPEEDING', 'ROUTE_DEVIATION', 'UNSCHEDULED_STOP', 'DELIVERY_CONFIRMED', 'DELAY_REPORTED');--> statement-breakpoint
CREATE TYPE "trip_assignment_status" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "trip_priority" AS ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT');--> statement-breakpoint
CREATE TYPE "trip_status" AS ENUM('DRAFT', 'PLANNED', 'ASSIGNED', 'READY', 'IN_PROGRESS', 'DELAYED', 'COMPLETED', 'CANCELLED', 'FAILED');--> statement-breakpoint
CREATE TYPE "trip_stop_status" AS ENUM('PENDING', 'ARRIVED', 'COMPLETED', 'SKIPPED', 'FAILED');--> statement-breakpoint
CREATE TYPE "trip_stop_type" AS ENUM('PICKUP', 'DELIVERY', 'CHECKPOINT', 'REST', 'FUEL', 'OTHER');--> statement-breakpoint
CREATE TYPE "trip_type" AS ENUM('DELIVERY', 'PICKUP', 'TRANSFER', 'SERVICE', 'PASSENGER', 'OTHER');--> statement-breakpoint
CREATE TYPE "maintenance_item_type" AS ENUM('PART', 'LABOR', 'SERVICE', 'OTHER');--> statement-breakpoint
CREATE TYPE "maintenance_type" AS ENUM('GENERAL_SERVICE', 'OIL_CHANGE', 'TYRE_REPLACEMENT', 'BRAKE_SERVICE', 'ENGINE_SERVICE', 'INSPECTION', 'OTHER');--> statement-breakpoint
CREATE TYPE "schedule_basis" AS ENUM('TIME', 'ODOMETER', 'BOTH');--> statement-breakpoint
CREATE TYPE "work_order_status" AS ENUM('OPEN', 'SCHEDULED', 'IN_PROGRESS', 'WAITING_FOR_PARTS', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "expense_status" AS ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PAID');--> statement-breakpoint
CREATE TYPE "payment_method" AS ENUM('CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CHEQUE', 'FUEL_CARD', 'OTHER');--> statement-breakpoint
CREATE TYPE "payment_status" AS ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "alert_severity" AS ENUM('INFO', 'WARNING', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "alert_status" AS ENUM('OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED');--> statement-breakpoint
CREATE TYPE "alert_type" AS ENUM('LICENSE_EXPIRING', 'LICENSE_EXPIRED', 'INSURANCE_EXPIRING', 'PERMIT_EXPIRING', 'MAINTENANCE_DUE', 'MAINTENANCE_OVERDUE', 'TRIP_DELAYED', 'VEHICLE_BREAKDOWN', 'SPEEDING', 'ROUTE_DEVIATION', 'HIGH_FUEL_CONSUMPTION', 'BUDGET_EXCEEDED');--> statement-breakpoint
CREATE TYPE "notification_channel" AS ENUM('IN_APP', 'EMAIL', 'SMS', 'PUSH');--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(150) NOT NULL,
	"code" varchar(30) NOT NULL UNIQUE,
	"email" varchar(255),
	"phone" varchar(30),
	"address" text,
	"timezone" varchar(50) DEFAULT 'UTC' NOT NULL,
	"currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" uuid,
	"name" varchar(100) NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"is_system_role" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"assigned_by" uuid
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" uuid,
	"name" varchar(150) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"phone" varchar(30),
	"password_hash" text,
	"status" "user_status" DEFAULT 'ACTIVE'::"user_status" NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"vehicle_id" uuid NOT NULL,
	"driver_id" uuid NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone,
	"assignment_type" "vehicle_assignment_type" DEFAULT 'TRIP_SPECIFIC'::"vehicle_assignment_type" NOT NULL,
	"status" "vehicle_assignment_status" DEFAULT 'ACTIVE'::"vehicle_assignment_status" NOT NULL,
	"assigned_by" uuid,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "vehicle_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"vehicle_id" uuid NOT NULL,
	"document_type" "vehicle_doc_type" NOT NULL,
	"document_number" varchar(100),
	"file_url" text NOT NULL,
	"issued_at" date,
	"expires_at" date,
	"verification_status" "verification_status" DEFAULT 'PENDING'::"verification_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"vehicle_id" uuid NOT NULL,
	"previous_status" "vehicle_status",
	"new_status" "vehicle_status" NOT NULL,
	"reason" text,
	"changed_by" uuid,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" uuid NOT NULL,
	"registration_number" varchar(50) NOT NULL,
	"vin" varchar(100),
	"vehicle_type" "vehicle_type" NOT NULL,
	"make" varchar(100),
	"model" varchar(100),
	"manufacturing_year" integer,
	"fuel_type" "fuel_type" DEFAULT 'DIESEL'::"fuel_type" NOT NULL,
	"capacity_kg" numeric(10,2),
	"capacity_volume_m3" numeric(10,2),
	"odometer_km" numeric(12,2) DEFAULT '0.00',
	"purchase_date" date,
	"purchase_price" numeric(12,2),
	"insurance_expiry_date" date,
	"permit_expiry_date" date,
	"fitness_expiry_date" date,
	"status" "vehicle_status" DEFAULT 'AVAILABLE'::"vehicle_status" NOT NULL,
	"current_location_lat" numeric(10,7),
	"current_location_lng" numeric(10,7),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "driver_availability" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"driver_id" uuid NOT NULL,
	"available_from" timestamp with time zone NOT NULL,
	"available_until" timestamp with time zone NOT NULL,
	"status" "driver_availability_status" NOT NULL,
	"reason" text
);
--> statement-breakpoint
CREATE TABLE "driver_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"driver_id" uuid NOT NULL,
	"document_type" "driver_doc_type" NOT NULL,
	"document_number" varchar(100),
	"file_url" text NOT NULL,
	"issued_at" date,
	"expires_at" date,
	"verification_status" "verification_status" DEFAULT 'PENDING'::"verification_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "driver_licenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"driver_id" uuid NOT NULL,
	"license_number" varchar(100) NOT NULL,
	"license_type" varchar(50) NOT NULL,
	"issuing_authority" varchar(150),
	"issued_at" date,
	"expires_at" date NOT NULL,
	"verification_status" "verification_status" DEFAULT 'PENDING'::"verification_status" NOT NULL,
	"is_primary" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "driver_safety_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"driver_id" uuid NOT NULL,
	"trip_id" uuid,
	"score" numeric(5,2) NOT NULL,
	"speeding_penalty" numeric(5,2) DEFAULT '0.00',
	"harsh_braking_penalty" numeric(5,2) DEFAULT '0.00',
	"incident_penalty" numeric(5,2) DEFAULT '0.00',
	"compliance_bonus" numeric(5,2) DEFAULT '0.00',
	"calculation_details" jsonb,
	"calculated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" uuid NOT NULL,
	"user_id" uuid,
	"employee_code" varchar(50),
	"full_name" varchar(150) NOT NULL,
	"email" varchar(255),
	"phone" varchar(30),
	"date_of_birth" date,
	"joining_date" date,
	"employment_status" "employment_status" DEFAULT 'ACTIVE'::"employment_status" NOT NULL,
	"availability_status" "driver_availability_status" DEFAULT 'AVAILABLE'::"driver_availability_status" NOT NULL,
	"emergency_contact_name" varchar(150),
	"emergency_contact_phone" varchar(30),
	"current_safety_score" numeric(5,2) DEFAULT '100.00',
	"total_distance_km" numeric(12,2) DEFAULT '0.00',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trip_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"trip_id" uuid NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"driver_id" uuid NOT NULL,
	"assigned_by" uuid,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"accepted_at" timestamp with time zone,
	"released_at" timestamp with time zone,
	"status" "trip_assignment_status" DEFAULT 'PENDING'::"trip_assignment_status" NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "trip_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"trip_id" uuid NOT NULL,
	"driver_id" uuid,
	"vehicle_id" uuid,
	"event_type" "event_type" NOT NULL,
	"severity" "event_severity" DEFAULT 'INFO'::"event_severity" NOT NULL,
	"latitude" numeric(10,7),
	"longitude" numeric(10,7),
	"description" text,
	"metadata" jsonb,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trip_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"trip_id" uuid NOT NULL,
	"previous_status" "trip_status",
	"new_status" "trip_status" NOT NULL,
	"reason" text,
	"location_lat" numeric(10,7),
	"location_lng" numeric(10,7),
	"changed_by" uuid,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trip_stops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"trip_id" uuid NOT NULL,
	"sequence_number" integer NOT NULL,
	"stop_type" "trip_stop_type" DEFAULT 'DELIVERY'::"trip_stop_type" NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text,
	"latitude" numeric(10,7),
	"longitude" numeric(10,7),
	"scheduled_arrival" timestamp with time zone,
	"actual_arrival" timestamp with time zone,
	"actual_departure" timestamp with time zone,
	"status" "trip_stop_status" DEFAULT 'PENDING'::"trip_stop_status" NOT NULL,
	"contact_name" varchar(150),
	"contact_phone" varchar(30),
	"delivery_notes" text,
	"proof_file_url" text
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" uuid NOT NULL,
	"trip_number" varchar(50) NOT NULL,
	"title" varchar(150) NOT NULL,
	"trip_type" "trip_type" DEFAULT 'DELIVERY'::"trip_type" NOT NULL,
	"priority" "trip_priority" DEFAULT 'NORMAL'::"trip_priority" NOT NULL,
	"status" "trip_status" DEFAULT 'DRAFT'::"trip_status" NOT NULL,
	"origin_name" varchar(255),
	"origin_address" text,
	"origin_lat" numeric(10,7),
	"origin_lng" numeric(10,7),
	"destination_name" varchar(255),
	"destination_address" text,
	"destination_lat" numeric(10,7),
	"destination_lng" numeric(10,7),
	"scheduled_start_at" timestamp with time zone NOT NULL,
	"scheduled_end_at" timestamp with time zone NOT NULL,
	"actual_start_at" timestamp with time zone,
	"actual_end_at" timestamp with time zone,
	"estimated_distance_km" numeric(10,2),
	"actual_distance_km" numeric(10,2),
	"cargo_description" text,
	"cargo_weight_kg" numeric(10,2),
	"customer_name" varchar(150),
	"customer_phone" varchar(30),
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenance_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"work_order_id" uuid NOT NULL,
	"item_type" "maintenance_item_type" NOT NULL,
	"description" text NOT NULL,
	"quantity" numeric(10,2) DEFAULT '1.00' NOT NULL,
	"unit_cost" numeric(10,2) NOT NULL,
	"total_cost" numeric(10,2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenance_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"vehicle_id" uuid NOT NULL,
	"maintenance_type" "maintenance_type" NOT NULL,
	"schedule_basis" "schedule_basis" DEFAULT 'TIME'::"schedule_basis" NOT NULL,
	"interval_days" integer,
	"interval_km" numeric(10,2),
	"last_service_date" date,
	"last_service_odometer" numeric(12,2),
	"next_due_date" date,
	"next_due_odometer" numeric(12,2),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenance_work_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" uuid NOT NULL,
	"work_order_number" varchar(50) NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"schedule_id" uuid,
	"service_provider_id" uuid,
	"maintenance_type" "maintenance_type" NOT NULL,
	"priority" "trip_priority" DEFAULT 'NORMAL'::"trip_priority" NOT NULL,
	"status" "work_order_status" DEFAULT 'OPEN'::"work_order_status" NOT NULL,
	"reported_issue" text,
	"diagnosis" text,
	"scheduled_at" timestamp with time zone,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"odometer_at_service" numeric(12,2),
	"labor_cost" numeric(10,2) DEFAULT '0.00',
	"parts_cost" numeric(10,2) DEFAULT '0.00',
	"tax_amount" numeric(10,2) DEFAULT '0.00',
	"total_cost" numeric(10,2) DEFAULT '0.00',
	"created_by" uuid,
	"approved_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" uuid NOT NULL,
	"name" varchar(150) NOT NULL,
	"contact_person" varchar(150),
	"phone" varchar(30),
	"email" varchar(255),
	"address" text,
	"tax_number" varchar(100),
	"rating" numeric(3,2),
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fuel_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" uuid NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"driver_id" uuid,
	"trip_id" uuid,
	"fuel_type" "fuel_type" DEFAULT 'DIESEL'::"fuel_type" NOT NULL,
	"quantity_liters" numeric(10,2) NOT NULL,
	"price_per_liter" numeric(10,2) NOT NULL,
	"total_amount" numeric(12,2) NOT NULL,
	"odometer_km" numeric(12,2) NOT NULL,
	"fuel_station_name" varchar(150),
	"receipt_number" varchar(100),
	"receipt_url" text,
	"latitude" numeric(10,7),
	"longitude" numeric(10,7),
	"filled_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expense_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" uuid NOT NULL,
	"expense_number" varchar(50) NOT NULL,
	"category_id" uuid NOT NULL,
	"vehicle_id" uuid,
	"driver_id" uuid,
	"trip_id" uuid,
	"work_order_id" uuid,
	"amount" numeric(12,2) NOT NULL,
	"tax_amount" numeric(10,2) DEFAULT '0.00',
	"currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"expense_date" date NOT NULL,
	"vendor_name" varchar(150),
	"description" text,
	"receipt_url" text,
	"status" "expense_status" DEFAULT 'SUBMITTED'::"expense_status" NOT NULL,
	"submitted_by" uuid,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"rejection_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" uuid NOT NULL,
	"expense_id" uuid,
	"payment_reference" varchar(100) NOT NULL,
	"amount" numeric(12,2) NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"payment_status" "payment_status" DEFAULT 'COMPLETED'::"payment_status" NOT NULL,
	"paid_at" timestamp with time zone NOT NULL,
	"notes" text,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" uuid NOT NULL,
	"alert_type" "alert_type" NOT NULL,
	"severity" "alert_severity" DEFAULT 'WARNING'::"alert_severity" NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"vehicle_id" uuid,
	"driver_id" uuid,
	"trip_id" uuid,
	"work_order_id" uuid,
	"status" "alert_status" DEFAULT 'OPEN'::"alert_status" NOT NULL,
	"due_at" timestamp with time zone,
	"acknowledged_by" uuid,
	"acknowledged_at" timestamp with time zone,
	"resolved_by" uuid,
	"resolved_at" timestamp with time zone,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"alert_id" uuid,
	"channel" "notification_channel" DEFAULT 'IN_APP'::"notification_channel" NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" uuid NOT NULL,
	"user_id" uuid,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" uuid,
	"old_values" jsonb,
	"new_values" jsonb,
	"ip_address" varchar(100),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_fleet_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" uuid NOT NULL,
	"metric_date" date NOT NULL,
	"total_vehicles" integer DEFAULT 0 NOT NULL,
	"available_vehicles" integer DEFAULT 0 NOT NULL,
	"vehicles_in_transit" integer DEFAULT 0 NOT NULL,
	"vehicles_in_maintenance" integer DEFAULT 0 NOT NULL,
	"total_trips" integer DEFAULT 0 NOT NULL,
	"completed_trips" integer DEFAULT 0 NOT NULL,
	"cancelled_trips" integer DEFAULT 0 NOT NULL,
	"total_distance_km" numeric(12,2) DEFAULT '0.00',
	"total_fuel_liters" numeric(12,2) DEFAULT '0.00',
	"total_fuel_cost" numeric(12,2) DEFAULT '0.00',
	"total_maintenance_cost" numeric(12,2) DEFAULT '0.00',
	"total_operating_cost" numeric(12,2) DEFAULT '0.00',
	"vehicle_utilization_percent" numeric(5,2) DEFAULT '0.00',
	"on_time_delivery_percent" numeric(5,2) DEFAULT '0.00',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_roles_org_id" ON "roles" ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_roles_user_id_role_id_unique" ON "user_roles" ("user_id","role_id");--> statement-breakpoint
CREATE INDEX "idx_user_roles_user_id" ON "user_roles" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_roles_role_id" ON "user_roles" ("role_id");--> statement-breakpoint
CREATE INDEX "idx_users_org_id" ON "users" ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" ("email");--> statement-breakpoint
CREATE INDEX "idx_vehicle_assignments_vehicle_id" ON "vehicle_assignments" ("vehicle_id");--> statement-breakpoint
CREATE INDEX "idx_vehicle_assignments_driver_id" ON "vehicle_assignments" ("driver_id");--> statement-breakpoint
CREATE INDEX "idx_vehicle_documents_expiry" ON "vehicle_documents" ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_vehicle_documents_vehicle_id" ON "vehicle_documents" ("vehicle_id");--> statement-breakpoint
CREATE INDEX "idx_vehicle_status_history_vehicle_id" ON "vehicle_status_history" ("vehicle_id");--> statement-breakpoint
CREATE UNIQUE INDEX "vehicles_org_reg_unique" ON "vehicles" ("organization_id","registration_number");--> statement-breakpoint
CREATE INDEX "idx_vehicles_org_status" ON "vehicles" ("organization_id","status");--> statement-breakpoint
CREATE INDEX "idx_driver_availability_driver_id" ON "driver_availability" ("driver_id");--> statement-breakpoint
CREATE INDEX "idx_driver_documents_driver_id" ON "driver_documents" ("driver_id");--> statement-breakpoint
CREATE UNIQUE INDEX "driver_licenses_driver_id_license_number_unique" ON "driver_licenses" ("driver_id","license_number");--> statement-breakpoint
CREATE INDEX "idx_driver_licenses_expiry" ON "driver_licenses" ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_driver_licenses_driver_id" ON "driver_licenses" ("driver_id");--> statement-breakpoint
CREATE INDEX "idx_driver_safety_scores_driver_id" ON "driver_safety_scores" ("driver_id");--> statement-breakpoint
CREATE INDEX "idx_drivers_org_availability" ON "drivers" ("organization_id","availability_status");--> statement-breakpoint
CREATE INDEX "idx_drivers_user_id" ON "drivers" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_trip_assignments_trip_id" ON "trip_assignments" ("trip_id");--> statement-breakpoint
CREATE INDEX "idx_trip_assignments_vehicle" ON "trip_assignments" ("vehicle_id","status");--> statement-breakpoint
CREATE INDEX "idx_trip_assignments_driver" ON "trip_assignments" ("driver_id","status");--> statement-breakpoint
CREATE INDEX "idx_trip_events_trip_id" ON "trip_events" ("trip_id");--> statement-breakpoint
CREATE INDEX "idx_trip_events_type_severity" ON "trip_events" ("event_type","severity");--> statement-breakpoint
CREATE INDEX "idx_trip_status_history_trip_id" ON "trip_status_history" ("trip_id");--> statement-breakpoint
CREATE UNIQUE INDEX "trip_stops_trip_seq_unique" ON "trip_stops" ("trip_id","sequence_number");--> statement-breakpoint
CREATE INDEX "idx_trip_stops_trip_id" ON "trip_stops" ("trip_id");--> statement-breakpoint
CREATE UNIQUE INDEX "trips_org_number_unique" ON "trips" ("organization_id","trip_number");--> statement-breakpoint
CREATE INDEX "idx_trips_org_status_start" ON "trips" ("organization_id","status","scheduled_start_at");--> statement-breakpoint
CREATE INDEX "idx_maintenance_items_work_order_id" ON "maintenance_items" ("work_order_id");--> statement-breakpoint
CREATE INDEX "idx_maintenance_due_date" ON "maintenance_schedules" ("next_due_date");--> statement-breakpoint
CREATE INDEX "idx_maintenance_schedules_vehicle_id" ON "maintenance_schedules" ("vehicle_id");--> statement-breakpoint
CREATE INDEX "idx_work_orders_org_id" ON "maintenance_work_orders" ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_work_orders_vehicle_id" ON "maintenance_work_orders" ("vehicle_id");--> statement-breakpoint
CREATE INDEX "idx_work_orders_status" ON "maintenance_work_orders" ("status");--> statement-breakpoint
CREATE INDEX "idx_service_providers_org_id" ON "service_providers" ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_fuel_logs_vehicle_date" ON "fuel_logs" ("vehicle_id","filled_at");--> statement-breakpoint
CREATE INDEX "idx_fuel_logs_org_id" ON "fuel_logs" ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_fuel_logs_driver_id" ON "fuel_logs" ("driver_id");--> statement-breakpoint
CREATE INDEX "idx_fuel_logs_trip_id" ON "fuel_logs" ("trip_id");--> statement-breakpoint
CREATE INDEX "idx_expense_categories_org_id" ON "expense_categories" ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_expenses_org_date" ON "expenses" ("organization_id","expense_date");--> statement-breakpoint
CREATE INDEX "idx_expenses_vehicle_id" ON "expenses" ("vehicle_id");--> statement-breakpoint
CREATE INDEX "idx_expenses_driver_id" ON "expenses" ("driver_id");--> statement-breakpoint
CREATE INDEX "idx_expenses_trip_id" ON "expenses" ("trip_id");--> statement-breakpoint
CREATE INDEX "idx_payments_org_id" ON "payments" ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_payments_expense_id" ON "payments" ("expense_id");--> statement-breakpoint
CREATE INDEX "idx_alerts_org_status" ON "alerts" ("organization_id","status","severity");--> statement-breakpoint
CREATE INDEX "idx_alerts_vehicle_id" ON "alerts" ("vehicle_id");--> statement-breakpoint
CREATE INDEX "idx_alerts_driver_id" ON "alerts" ("driver_id");--> statement-breakpoint
CREATE INDEX "idx_alerts_trip_id" ON "alerts" ("trip_id");--> statement-breakpoint
CREATE INDEX "idx_notifications_user_id" ON "notifications" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_notifications_alert_id" ON "notifications" ("alert_id");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_org_id" ON "audit_logs" ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_user_id" ON "audit_logs" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_action" ON "audit_logs" ("action");--> statement-breakpoint
CREATE UNIQUE INDEX "daily_fleet_metrics_org_date_unique" ON "daily_fleet_metrics" ("organization_id","metric_date");--> statement-breakpoint
CREATE INDEX "idx_daily_fleet_metrics_org_id" ON "daily_fleet_metrics" ("organization_id");--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assigned_by_users_id_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "vehicle_assignments" ADD CONSTRAINT "vehicle_assignments_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "vehicle_assignments" ADD CONSTRAINT "vehicle_assignments_driver_id_drivers_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "vehicle_assignments" ADD CONSTRAINT "vehicle_assignments_assigned_by_users_id_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "vehicle_documents" ADD CONSTRAINT "vehicle_documents_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "vehicle_status_history" ADD CONSTRAINT "vehicle_status_history_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "vehicle_status_history" ADD CONSTRAINT "vehicle_status_history_changed_by_users_id_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "driver_availability" ADD CONSTRAINT "driver_availability_driver_id_drivers_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "driver_documents" ADD CONSTRAINT "driver_documents_driver_id_drivers_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "driver_licenses" ADD CONSTRAINT "driver_licenses_driver_id_drivers_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "driver_safety_scores" ADD CONSTRAINT "driver_safety_scores_driver_id_drivers_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "trip_assignments" ADD CONSTRAINT "trip_assignments_trip_id_trips_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trip_assignments" ADD CONSTRAINT "trip_assignments_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trip_assignments" ADD CONSTRAINT "trip_assignments_driver_id_drivers_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trip_assignments" ADD CONSTRAINT "trip_assignments_assigned_by_users_id_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "trip_events" ADD CONSTRAINT "trip_events_trip_id_trips_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trip_events" ADD CONSTRAINT "trip_events_driver_id_drivers_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "trip_events" ADD CONSTRAINT "trip_events_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "trip_status_history" ADD CONSTRAINT "trip_status_history_trip_id_trips_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trip_status_history" ADD CONSTRAINT "trip_status_history_changed_by_users_id_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_trip_id_trips_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "maintenance_items" ADD CONSTRAINT "maintenance_items_work_order_id_maintenance_work_orders_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "maintenance_work_orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "maintenance_schedules" ADD CONSTRAINT "maintenance_schedules_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "maintenance_work_orders" ADD CONSTRAINT "maintenance_work_orders_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "maintenance_work_orders" ADD CONSTRAINT "maintenance_work_orders_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "maintenance_work_orders" ADD CONSTRAINT "maintenance_work_orders_DqG5Yki7KpdY_fkey" FOREIGN KEY ("schedule_id") REFERENCES "maintenance_schedules"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "maintenance_work_orders" ADD CONSTRAINT "maintenance_work_orders_CX2CF0838iks_fkey" FOREIGN KEY ("service_provider_id") REFERENCES "service_providers"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "maintenance_work_orders" ADD CONSTRAINT "maintenance_work_orders_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "maintenance_work_orders" ADD CONSTRAINT "maintenance_work_orders_approved_by_users_id_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "service_providers" ADD CONSTRAINT "service_providers_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "fuel_logs" ADD CONSTRAINT "fuel_logs_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "fuel_logs" ADD CONSTRAINT "fuel_logs_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "fuel_logs" ADD CONSTRAINT "fuel_logs_driver_id_drivers_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "fuel_logs" ADD CONSTRAINT "fuel_logs_trip_id_trips_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "expense_categories" ADD CONSTRAINT "expense_categories_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_category_id_expense_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "expense_categories"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_driver_id_drivers_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_trip_id_trips_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_work_order_id_maintenance_work_orders_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "maintenance_work_orders"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_submitted_by_users_id_fkey" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_approved_by_users_id_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_expense_id_expenses_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "expenses"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_driver_id_drivers_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_trip_id_trips_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_work_order_id_maintenance_work_orders_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "maintenance_work_orders"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_acknowledged_by_users_id_fkey" FOREIGN KEY ("acknowledged_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_resolved_by_users_id_fkey" FOREIGN KEY ("resolved_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_alert_id_alerts_id_fkey" FOREIGN KEY ("alert_id") REFERENCES "alerts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "daily_fleet_metrics" ADD CONSTRAINT "daily_fleet_metrics_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;
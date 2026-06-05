# FaceCap Architecture

## Overview
FaceCap is an offline-first React Native prototype that simulates facial recognition and liveness detection while preserving a production-grade architecture.

## Core Layers
- **UI Layer**: Screens + reusable components for enrollment, verification, sync, and settings.
- **Service Layer**: Biometric simulation, local database abstraction, network monitor, and AWS sync engine.
- **Data Layer**: Local JSON/AsyncStorage persistence with SQLite schema mapping for deployment.

## SQLite Schema
- `users(id, name, faceEncodingHash, enrollmentDate)`
- `attendance_records(id, userId, timestamp, confidence, syncedToAWS)`
- `sync_queue(id, recordId, status, lastAttempt, retryCount)`

## Offline-First Design
- Enrollment and verification write immediately to local storage.
- Sync queue tracks pending uploads.
- AWS sync retries with exponential backoff and marks failures.
- Successful sync purges attendance records from local store.

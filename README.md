# FaceCap

Offline facial recognition and liveness detection prototype for React Native (iOS/Android).

## Implemented Features
- Home, Enrollment, Verification, Sync, and Settings screens
- Simulated face detection (confidence 85-99%)
- Multi-step liveness flow (blink, smile, head turn)
- Offline local persistence with SQLite-oriented schema abstraction
- AWS sync queue with retry + exponential backoff
- Sync & purge workflow and history tracking

## Project Structure
```text
FaceCap/
├── src/
│   ├── screens/
│   ├── components/
│   ├── services/
│   ├── navigation/
│   ├── utils/
│   └── types/
├── Documentation/
├── App.tsx
└── package.json
```

## Commands
```bash
npm install
npm run lint
npm test
npm run start
```

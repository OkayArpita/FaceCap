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

## Application Demo
<img width="539" height="1079" alt="Screenshot 2026-06-05 234942" src="https://github.com/user-attachments/assets/260f96a4-8bcf-4027-bf15-429f187e2507" />
<img width="546" height="1079" alt="Screenshot 2026-06-05 235329" src="https://github.com/user-attachments/assets/621e1f0f-0c56-4048-9e00-f70e733ce724" />
<img width="542" height="1079" alt="Screenshot 2026-06-05 235545" src="https://github.com/user-attachments/assets/7a278072-f754-44a4-9251-878ac1727372" />

/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/StudentLogin` | `/StudentRegister` | `/TeacherDashboard` | `/TeacherLogin` | `/TeacherRegister` | `/_sitemap` | `/navigation` | `/navigation/Notification` | `/navigation/StudentDashboard` | `/navigation/StudentProfile`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Meetings from '@/views/MeetingsList.vue';
import MeetingDetails from '@/views/MeetingDetails.vue';

export const ROUTE_MEETING_LIST = 'MeetingList';
export const ROUTE_MEETING_DETAILS = 'MeetingDetails';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: ROUTE_MEETING_LIST,
    component: Meetings,
  },
  {
    path: '/meeting/:id',
    name: ROUTE_MEETING_DETAILS,
    component: MeetingDetails,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

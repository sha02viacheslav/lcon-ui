import { SearchKey } from '@enums';

export const SEARCH_LABELS: { [key: string]: string } = {
  [SearchKey.SR]: 'Century SR',
  [SearchKey.SERVICE_ORDER_ID]: 'Century Service ID',
  [SearchKey.PROJECT_MANAGER]: 'Manager',
  [SearchKey.CARRIER]: 'Customer Name',
  [SearchKey.STATUS]: 'Status',
  [SearchKey.NOTES]: 'Notes',
  [SearchKey.CPM_EMAIL_UPDATE]: 'CPM Name',
  [SearchKey.PON]: 'PON',
};

export const SEARCH_OPTIONS = [
  { label: SEARCH_LABELS[SearchKey.SR], value: SearchKey.SR },
  { label: SEARCH_LABELS[SearchKey.SERVICE_ORDER_ID], value: SearchKey.SERVICE_ORDER_ID },
  { label: SEARCH_LABELS[SearchKey.PROJECT_MANAGER], value: SearchKey.PROJECT_MANAGER },
  { label: SEARCH_LABELS[SearchKey.CARRIER], value: SearchKey.CARRIER },
  { label: SEARCH_LABELS[SearchKey.STATUS], value: SearchKey.STATUS },
  { label: SEARCH_LABELS[SearchKey.NOTES], value: SearchKey.NOTES },
  { label: SEARCH_LABELS[SearchKey.CPM_EMAIL_UPDATE], value: SearchKey.CPM_EMAIL_UPDATE },
  { label: SEARCH_LABELS[SearchKey.PON], value: SearchKey.PON },
];

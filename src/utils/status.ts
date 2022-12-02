export const STATUS = {
  ACTIVE: 'ACTIVE',
  DEACTIVE: 'DEACTIVE',
  UNKNOWN: 'UNKNOWN',
};

export const CONTACT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  RESOLVED: 'RESOLVED',
  ABORTED: 'ABORTED',
  UNKNOWN: 'UNKNOWN',
};

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
  ABORTED: 'ABORTED',
  UNKNOWN: 'UNKNOWN',
};

export const COMMENT_STATUS = {
  REJECTED: 'REJECTED',
  APPROVED: 'APPROVED',
  UNKNOWN: 'UNKNOWN',
};

export const transformStatus = (status: Record<string, string>) => {
  return Object.entries(status).map(([key, value]) => {
    return {
      value: key,
      label: value,
    };
  });
};

import { HttpMethod } from "@/utils/httpMethod";
import { components } from "../../api/schema";

export type TimeRangesAvailabilityBody = {
  untilWhen: Date;
};

export type TimeRange = {
  from: Date;
  until: Date;
};

export const getLendTimeRanges = (
  parkingId: number,
  body: TimeRangesAvailabilityBody
) => {
  const query = new URLSearchParams({
    untilWhen: body.untilWhen.toISOString(),
  }).toString();
  return fetch(
    `/api/v1/parkings/${parkingId}/lend/available-timeranges?${query}`,
    {
      method: HttpMethod.GET,
    }
  ).then((response) => 
    {if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    } return response.json()});
};

export const getLendSpots = (parkingId: number, body: TimeRange) => {
  const query = new URLSearchParams({
    from: body.from.toISOString(),
    until: body.until.toISOString(),
  }).toString();
  return fetch(`/api/v1/parkings/${parkingId}/lend/available-spots?${query}`, {
    method: HttpMethod.GET,
  }).then((response) => 
    {if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    } return response.json()});
};

export const getBorrowTimeRanges = (
  parkingId: number,
  body: TimeRangesAvailabilityBody
) => {
  const query = new URLSearchParams({
    untilWhen: body.untilWhen.toISOString(),
  }).toString();
  return fetch(
    `/api/v1/parkings/${parkingId}/borrow/available-timeranges?${query}`,
    {
      method: HttpMethod.GET,
    }
  ).then((response) => 
    {if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    } return response.json()});
};

export const getBorrowSpots = (parkingId: number, body: TimeRange) => {
  const query = new URLSearchParams({
    from: body.from.toISOString(),
    until: body.until.toISOString(),
  }).toString();
  return fetch(
    `/api/v1/parkings/${parkingId}/borrow/available-spots?${query}`,
    {
      method: HttpMethod.GET,
    }
  ).then((response) => 
    {if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    } return response.json()});
};

export interface CreateBorrowLendProps {
  parkingId: number;
  spotId: string;
  body: TimeRange;
}
export const borrowSpot = ({
  parkingId,
  spotId,
  body,
}: CreateBorrowLendProps) => {
  const toBeSentBody: components["schemas"]["TimeRangeRequest"] = {
    fromWhen: body.from.toISOString(),
    untilWhen: body.until.toISOString(),
  };
  return fetch(`/api/v1/parkings/${parkingId}/borrow/${spotId}`, {
    method: HttpMethod.POST,
    body: JSON.stringify(toBeSentBody),
  }).then((response) => 
    {if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    } return response.json()});
};

export const lendSpot = ({
  parkingId,
  spotId,
  body,
}: CreateBorrowLendProps) => {
  const toBeSentBody: components["schemas"]["TimeRangeRequest"] = {
    fromWhen: body.from.toISOString(),
    untilWhen: body.until.toISOString(),
  };
  return fetch(`/api/v1/parkings/${parkingId}/lend/${spotId}`, {
    method: HttpMethod.POST,
    body: JSON.stringify(toBeSentBody),
  }).then((response) => 
    {if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    } return response.json()});
};

export const deleteBorrow = (id: string) =>
  fetch(`/api/v1/borrow/${id}`, {
    method: HttpMethod.DELETE,
  }).then((response) => 
    {if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    } return "Cancelled borrowing successfully."});

export const deleteLend = (id: string) =>
  fetch(`/api/v1/lend/${id}`, {
    method: HttpMethod.DELETE,
  }).then((response) => 
    {if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    } return "Cancelled lending successfully."});

export interface Paging {
  page: number;
  size: number;
  sort?: string;
}

export const getMyLends = ({ page, size, sort }: Paging) => {
  const query = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...(sort && { sort }),
  }).toString();
  return fetch(`/api/v1/lend/mine?${query}`, {
    method: HttpMethod.GET,
  }).then((response) => 
    {if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    } return response.json()});
};


export const getMyBorrows = ({ page, size, sort }: Paging) => {
  const query = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...(sort && { sort }),
  }).toString();
  return fetch(`/api/v1/borrow/mine?${query}`, {
    method: HttpMethod.GET,
  }).then((response) => 
    {if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    } return response.json()});
};

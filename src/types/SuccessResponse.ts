export type SuccessResponse<TData> = {
	status: "success";
	message: string;
	data?: TData;
};

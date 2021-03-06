import {
	useCallback, useReducer 
} from "preact/hooks";

import {
	sendRequestWithTimeout, sleep 
} from "Util/timeout";

export const STATUS_FETCHING = "FETCHING";
export const STATUS_ERROR = "ERROR";
export const STATUS_TIMEOUT = "TIMEOUT";
export const STATUS_SUCCESS = "SUCCESS";

export const useAPIStatusProvider = (endpoint, options = {}) => {

	const fetching = () => ({ type: STATUS_FETCHING });
	const error = () => ({ type: STATUS_ERROR });
	const timeout = () => ({ type: STATUS_TIMEOUT });
	const success = data => ({ type: STATUS_SUCCESS, data });

	const initialState = {
		status: null,
		data: null,
	};

	const responseReducer = (state = initialState, action) => {
		const { type, data } = action;
		switch (type) {
		case STATUS_FETCHING:
			return { status: STATUS_FETCHING };
		case STATUS_ERROR:
			return { status: STATUS_ERROR };
		case STATUS_TIMEOUT:
			return { status: STATUS_TIMEOUT };
		case STATUS_SUCCESS:
			return { status: STATUS_SUCCESS, data };
		default:
			return state;
		}
	};

	const [response, dispatchStatus] = useReducer(responseReducer, initialState);
	const makeRequest = useCallback(async () => {
		try {
			dispatchStatus(fetching());
			const httpResponse = await Promise.all([sendRequestWithTimeout(1000, endpoint, options), sleep(50)]);
			dispatchStatus(success(httpResponse));
		} catch (e) {
			if (e.timeout) {
				dispatchStatus(timeout());
			} else {
				dispatchStatus(error());
			}
		}
	}, [endpoint, options]);
	return [response, makeRequest];
};

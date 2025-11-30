import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const formDataApis = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1/',
    }),
    endpoints: (builder) => ({
        // Query for fetching data
        salesforceAuth: builder.query({
            query: () => 'salesforceLogin',
        }),
        // Mutation for posting data
        postFormData: builder.mutation({
            query: (formData) => ({
                url: 'sendLeadToSalesforce',
                method: 'POST',
                body: formData,
            }),
        }),
    }),
});

export const { useSalesforceAuthQuery, usePostFormDataMutation } = formDataApis;

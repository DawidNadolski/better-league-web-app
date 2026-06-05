const GRAPHQL_URL = process.env.VUE_APP_GRAPHQL_URL || 'http://localhost:8080/graphql';

export function graphqlFetch(body, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers.Authorization = token;
    }

    return fetch(GRAPHQL_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });
}

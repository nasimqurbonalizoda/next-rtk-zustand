import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface Itodo {
    id: number,
    name: string,
    age: number | string
    status: boolean
}

export const pokemonApi = createApi({
    reducerPath: 'pokemonApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://689efc1f3fed484cf878a4ca.mockapi.io/'
     }),
    tagTypes: ['todo'],
    endpoints: (builder) => ({
        getPokemonByName: builder.query<Itodo[], void>({
            query: () => `users`,
            providesTags: ['todo']
        }),
        addPokemon: builder.mutation<Itodo, Partial<Itodo>>({
            query: (body) => ({
                url: `users`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['todo'],
        }),
        editPokemon: builder.mutation<Itodo, Itodo>({
            query: ({ id, ...patch }) => ({
                url: `users/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: ['todo'],
        }),
        deletePokemon: builder.mutation<Itodo, number>({
            query: (id) => ({
                url: `users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['todo'],
        }),

    }),
})


export const {
    useGetPokemonByNameQuery,
    useAddPokemonMutation,
    useEditPokemonMutation,
    useDeletePokemonMutation,
} = pokemonApi
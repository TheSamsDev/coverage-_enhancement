import { supabase } from './supabase'

export const signIn = async ({ email, password }) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) throw error
        return { data, error: null }
    } catch (error) {
        return { data: null, error }
    }
}

export const signUp = async ({ email, password }) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
        if (error) throw error
        return { data, error: null }
    } catch (error) {
        return { data: null, error }
    }
}

export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        return { error: null }
    } catch (error) {
        return { error }
    }
}

export const getCurrentUser = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return { user, error: null }
    } catch (error) {
        return { user: null, error }
    }
}

export const getSession = async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        return { session, error: null }
    } catch (error) {
        return { session: null, error }
    }
}
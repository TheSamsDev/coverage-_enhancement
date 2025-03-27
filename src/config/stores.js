import { supabase } from './supabase'

// Store operations
export const getStores = async () => {
    try {
        const { data, error } = await supabase
            .from('shops')
            .select('*')
        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error fetching stores:', error)
        return { data: null, error }
    }
}

export const getStoresByRegion = async (region) => {
    try {
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .eq('region', region)
        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error fetching stores by region:', error)
        return { data: null, error }
    }
}

export const getStoresByCity = async (city) => {
    try {
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .eq('city', city)
        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error fetching stores by city:', error)
        return { data: null, error }
    }
}

export const getStoresByChannel = async (channel) => {
    try {
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .eq('channel', channel)
        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error fetching stores by channel:', error)
        return { data: null, error }
    }
}

export const getStoresByRank = async (rank) => {
    try {
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .eq('rank', rank)
        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error fetching stores by rank:', error)
        return { data: null, error }
    }
}
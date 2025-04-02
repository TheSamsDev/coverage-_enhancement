import { supabase } from './supabase'

// Store operations
export const getStores = async () => {
    try {
        const { data, error } = await supabase
            .from('stores')
            .select('*')
        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error fetching stores:', error)
        return { data: null, error }
    }
}

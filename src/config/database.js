import { supabase } from './supabase'

// Table operations
export const getTables = async () => {
    try {
        const { data, error } = await supabase
            .from('tables')
            .select('*')
        if (error) throw error
        return { data, error: null }
    } catch (error) {
        return { data: null, error }
    }
}

// Mock Sales Analytics Data
export const getSalesData = async (period = 'monthly') => {
    const mockData = [
        { product: 'Product A', percentage: 42 },
        { product: 'Product B', percentage: 26 },
        { product: 'Product C', percentage: 32 }
    ];
    return { data: mockData, error: null };
}

// Mock Revenue Analytics Data
export const getRevenueData = async (period = 'monthly') => {
    const mockData = [
        { period: period, date: new Date().toISOString(), revenue: 44252, growth_percentage: 2.65 },
        { period: period, date: new Date(Date.now() - 86400000).toISOString(), revenue: 43852, growth_percentage: 2.45 }
    ];
    return { data: mockData, error: null };
}

// Store operations
export const getStoreLocations = async () => {
    try {
        const { data, error } = await supabase
            .from('stores')
            .select('*')
        if (error) throw error
        return { data, error: null }
    } catch (error) {
        return { data: null, error }
    }
}

// Shop operations
export const getShopData = async () => {
    try {
        const { data, error } = await supabase
            .from('shops')
            .select('*')
        if (error) throw error
        return { data, error: null }
    } catch (error) {
        return { data: null, error }
    }
}

// Recent Activity operations
export const getRecentActivity = async (limit = 10) => {
    try {
        const { data, error } = await supabase
            .from('recent_activity')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit)
        if (error) throw error
        return { data, error: null }
    } catch (error) {
        return { data: null, error }
    }
}

// Latest Transactions operations
export const getLatestTransactions = async (limit = 10) => {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit)
        if (error) throw error
        return { data, error: null }
    } catch (error) {
        return { data: null, error }
    }
}
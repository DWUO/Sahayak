import {createClient} from "@supabase/supabase-js"

const supabaseUrl = "https://fltbefopbckowogugusa.supabase.co"
const supabaseKey = "sb_publishable_d2k0eSmTx_NHtTC3liPBTw_BhdpvJo5"

export const supabase = createClient(supabaseUrl, supabaseKey)
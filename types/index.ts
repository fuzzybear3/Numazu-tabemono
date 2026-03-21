export interface Restaurant {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  google_place_id: string;
  cuisine_type: string | null;
  cuisine_category: 'ramen' | 'tonkatsu' | 'sushi' | 'other';
  cover_photo_url: string | null;
  seat_count: number | null;
  created_at: string;
}

export interface Visit {
  id: string;
  restaurant_id: string;
  user_id: string;
  visited_at: string;
  menu_item: string | null;
  food_photo_url: string | null;
  notes: string | null;
  created_at: string;
}

export interface Ranking {
  id: string;
  restaurant_id: string;
  user_id: string;
  rank_position: number;
  updated_at: string;
}

export interface RankedRestaurant extends Restaurant {
  rank_position: number;
}

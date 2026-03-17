export interface Restaurant {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  google_place_id: string;
  cuisine_type: string | null;
  cover_photo_url: string | null;
  created_at: string;
}

export interface Visit {
  id: string;
  restaurant_id: string;
  visited_at: string;
  menu_item: string | null;
  food_photo_url: string | null;
  notes: string | null;
  created_at: string;
}

export interface Ranking {
  id: string;
  restaurant_id: string;
  rank_position: number;
  updated_at: string;
}

export interface RankedRestaurant extends Restaurant {
  rank_position: number;
}

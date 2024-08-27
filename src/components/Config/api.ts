import { useQuery } from "@tanstack/react-query";
import { KEY_QUERY } from "./key";
import { useState } from "react";
const PAGE_SIZE = 5;
interface IUser {
  id: number;
  name: string;
  email: string;
}
// const [totalPages, setTotalPages] = useState<number>(1);
export const userFetchUser = (currentPage: number) => {
  const fetchUser = useQuery({
    queryKey: KEY_QUERY.key_query(currentPage),
    queryFn: (): Promise<any> =>
      fetch(
        `http://localhost:8000/users?_page=${currentPage}&_limit=${PAGE_SIZE}`
      ).then(async (res) => {
        const total_items = +(res.headers?.get("x-total-count") ?? 0);
        const page_size = PAGE_SIZE;
        const total_pages = Math.round(
          total_items == 0 ? 0 : (total_items - 1) / page_size + 1
        );

        const d = await res.json();
        return { total_items, total_pages, data: d };
      }),
  });
  return {
    ...fetchUser,
    total_items: fetchUser?.data?.total_items ?? 0,
    total_pages: fetchUser?.data?.total_pages ?? 0,
    data: fetchUser?.data?.data ?? [],
    isPending: fetchUser?.isLoading ?? false,
  };
};

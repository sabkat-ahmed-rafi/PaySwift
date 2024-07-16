import { useQuery } from "@tanstack/react-query"
import { axiosSecure } from "./useAxiosSecure";
import useAuth from "./useAuth";

const useRole = () => {

    const {user} = useAuth()


    const { data: role, isLoading} = useQuery({
        queryKey: ['role', user],
        enabled: !!user?.email,
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/user/${user?.email}`)
            return data.role
        }
    })

    return [role, isLoading]

};

export default useRole;
import { atom } from 'jotai';

export const userAtom = atom({
    auth: false,
    id: -1,
    name: "",
    role: 2, //пользователь
});

export const modalAtom = atom("");

export const currentRoomAtom = atom(-1)
export const roomsAtom = atom([])
export const filterRoomsAtom = atom(false)
export const currentMessageAtom = atom("")
export const messagesAtom = atom([])
export const votingsAtom = atom([])
export const onLoadVotingsAtom = atom([])
export const roomUsersAtom = atom([])


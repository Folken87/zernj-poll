import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import socket from "../../context/socket"
import { currentRoomAtom, modalAtom } from "../../store/store"


export default function HistoryRoom() {
    const [currentRoom, setCurrentRoom] = useAtom(currentRoomAtom);
    const [history, setHistory] = useState([]);
    const [modal, setModal] = useAtom(modalAtom);
    socket.off("loadHistoryRoom");
    socket.on("loadHistoryRoom", data => {
        setHistory(data.result)
    });
    useEffect(() => {
        socket.emit("getHistoryRoom", {
            roomId: currentRoom
        })
    }, [])
    return (
        <div className='modalGlobal'>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">История комнаты</h5>
                </div>
                <div className="modal-body">
                    <div className="d-flex flex-column" style={{
                        width: "37.037vmin",
                        height: "55.556vmin",
                        overflowY: "auto"
                    }}>
                        {history.map((el, index) => {
                            return <span style={{
                                borderBottom: "1px solid gray"
                            }}>{getFormattedDate(el.date)} | {el.name} | {el.text}</span>
                        })}
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setModal("")}>Отмена</button>
                </div>
            </div>
        </div >
    )
}

function getFormattedDate(str) {
    return new Date(str).toLocaleTimeString("ru-RU") + " " + new Date(str).toLocaleDateString('ru-RU');
}

import { useHistory, useParams } from 'react-router-dom';

import { RoomCode } from '../components/RoomCode';
import { Button } from '../components/Button';
import { Question } from '../components/Question';

import { useRoom } from '../hooks/useRoom';


import logoImg from '../assets/logo.svg';
import deleteImg from '../assets/delete.svg';
import checkImg from '../assets/check.svg';
import answerImg from '../assets/answer.svg';

import '../styles/room.scss';
import { database } from '../services/firebase';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    //const { user } = useAuth();
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const {questions, title } = useRoom(roomId);

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/')
    }

    async function handleDeleteQuestion(questionId: string){
        if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        })
    }

    async function handleHighLightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighLighted: true,
        })
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeask" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button 
                            isOutlined
                            onClick={handleEndRoom}
                        >
                            Encerrar sala
                        </Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} {questions.length > 0 ? <p>quest??es</p> : <p>quest??o</p> }</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return(
                            <Question 
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighLighted={question.isHighlighted}
                            >
                               {!question.isAnswered && (
                                   <>
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar perguta como respondida" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHighLightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Dar destaque a pergunta" />
                                        </button>
                                    </>
                               )}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    );
}
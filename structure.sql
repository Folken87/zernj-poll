--создаём БД под чат
CREATE DATABASE zernjchat
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
	
--создаём таблицу под комнаты
CREATE TABLE public.rooms
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name text COLLATE pg_catalog."default" NOT NULL,
    owner bigint NOT NULL,
    active boolean NOT NULL,
    CONSTRAINT rooms_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.rooms
    OWNER to postgres;
	
--создаём таблицу для ролей
CREATE TABLE public.roles
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT roles_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.roles
    OWNER to postgres;
	
--заполняем таблицу ролей
INSERT INTO public.roles(name)
	VALUES ('Администратор'), ('Пользователь');
	
--создаём таблицу под юзеров
CREATE TABLE IF NOT EXISTS public.users
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name text COLLATE pg_catalog."default" NOT NULL,
    role bigint NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

--создаём таблицу под сообщения
CREATE TABLE public.messages
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    "textMessage" text COLLATE pg_catalog."default",
    owner bigint NOT NULL,
    "sendDate" date NOT NULL,
    room bigint NOT NULL,
    CONSTRAINT messages_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.messages
    OWNER to postgres;

ALTER TABLE public.messages
    ALTER COLUMN "sendDate" TYPE timestamp without time zone ;

--таблица голосований
CREATE TABLE public.votings
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 ),
    "nameVote" text NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.votings
    OWNER to postgres;

--таблица ответов
CREATE TABLE public.answers
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 ),
    "idVote" bigint NOT NULL,
    "answerValue" text NOT NULL,
    PRIMARY KEY ("idVote")
);

ALTER TABLE IF EXISTS public.answers
    OWNER to postgres;


--таблица голосов
CREATE TABLE public.votes
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 ),
    "userId" bigint NOT NULL,
    "idVote" bigint NOT NULL,
    "idAnswer" bigint NOT NULL,
    PRIMARY KEY ("idVote")
);

ALTER TABLE IF EXISTS public.votes
    OWNER to postgres;

--добавил связку id комнаты к таблице голосований
ALTER TABLE IF EXISTS public.votings
    ADD COLUMN "roomId" bigint NOT NULL;


--добавил столбец "Тип сообщения" в messages
ALTER TABLE IF EXISTS public.messages
    ADD COLUMN type integer NOT NULL DEFAULT 0;


--поменял PK у таблицы Anwers
ALTER TABLE IF EXISTS public.answers DROP CONSTRAINT IF EXISTS answers_pkey;

ALTER TABLE IF EXISTS public.answers
    ADD PRIMARY KEY (id);

<<<<<<< HEAD

-- логи
CREATE TABLE IF NOT EXISTS public.logs
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 ),
    "userId" bigint NOT NULL,
    "roomId" bigint,
    text text,
    PRIMARY KEY (id)
);

ALTER TABLE public.logs
    OWNER to postgres;
ALTER TABLE public.logs
    ADD COLUMN date timestamp without time zone;
=======
--удалил PK у таблицы votes
ALTER TABLE IF EXISTS public.votes DROP CONSTRAINT IF EXISTS votes_pkey;

>>>>>>> 692774c99eb9a13bbd4205f129d891ce341d0c24

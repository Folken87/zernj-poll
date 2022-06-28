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
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 ),
    "textMessage" text,
    owner bigint NOT NULL,
    "sendDate" date NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.messages
    OWNER to postgres;
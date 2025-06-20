import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Header, Container, Form, FormError } from "./styles";
import { ArrowRight } from "phosphor-react";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "../../lib/axios";
import { AxiosError } from "axios";

const registerFormSchema = z.object({
  username: z
  .string()
  .min(3, { message: 'O usuário precisa ter pelo menos 3 caracteres.' })
  .regex(/^([a-z\\\\-]+)$/i, { 
    message: 'O usuário pode conter apenas letras e hifens.'
  })
  .transform((username) => username.toLowerCase()),
  name: z.string().min(3, { message: 'O nome precisa ter pelo menos 3 caracteres.' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
    const { 
        register, 
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }, 
        setError,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            username: '',
            name: '',
        },
    })

    const router = useRouter();

    useEffect(() => {
        if (router.query?.username) {
            setValue('username', String(router.query.username));
        }
    }, [router.query?.username, setValue]);

    async function handleRegister(data: RegisterFormData) {
        try {
            await api.post('/users', {
                name: data.name,
                username: data.username,
            })

            await router.push('/register/connect-calendar')
        } catch (err) {
            if(err instanceof AxiosError && err?.response?.data?.message) {
                setError('username', { message: err.response.data.message })
                return
            }

            console.log(err)
        }
    }

    return (
        <Container>
            <Header>
                <Heading as="strong">
                    Bem-vindo ao Ignite Call!
                </Heading>
                <Text>
                    Precisamos de algumas informações para criar seu perfil! Ah, e você pode editar essas informações depois.
                </Text>

                <MultiStep size={4} currentStep={1}/>
            </Header>

            <Form as="form" onSubmit={handleSubmit(handleRegister)}>
                <label>
                    <Text size="sm">Nome de usuário</Text>
                    <TextInput 
                    prefix="ignite.com/" 
                    placeholder="seu-usuario"
                    {...register('username')}
                    />

                    {errors.username && (
                        <FormError size="sm">
                            {errors.username.message}
                        </FormError>
                    )}
                </label>

                <label>
                    <Text size="sm">Nome completo</Text>
                    <TextInput 
                    placeholder="Seu nome"
                    {...register('name')}
                    />

                    {errors.name && (
                        <FormError size="sm">
                            {errors.name.message}
                        </FormError>
                    )}
                </label>

                <Button type="submit" disabled={isSubmitting}>
                    Próximo passo
                    <ArrowRight />
                </Button>
            </Form>
        </Container>
    )
}
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import { Card, CardDescription, CardTitle } from "./ui/card"

type ToDo = {
  id: string;
  title: string;
  checked: boolean;
};

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Você precisa selecionar um item.",
  }),
})

export function ToDoList() {
  const [toDos, setToDos] = useState<{ id: string, title: string, checked: boolean }[]>([]);
  const [newTodoText, setNewTodoText] = useState("");

  const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  })

  function onSubmit() {
    toast({
      title: "Tarefa atualizada!",
      description: "Sua lista de tarefas foi atualizada com sucesso.",
    })
  }

  const addToDo = async () => {
    if (newTodoText.trim() === "") return;

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todos`, {
        title: newTodoText,
        checked: false,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      
      setToDos([...toDos, {
        id: response.data.id,
        title: response.data.title,
        checked: response.data.checked
      }]);
      setNewTodoText("");
    } catch (error) {
      toast({
        title: "Erro",
        description: `Houve um problema ao adicionar a tarefa. ${error}`,
        variant: "destructive"
      });
    }
  }

  const removeToDo = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todos/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      setToDos(toDos.filter((todo) => todo.id !== id));
    } catch (error) {
      toast({
        title: "Erro",
        description: `Houve um problema ao deletar a tarefa. ${error}`,
        variant: "destructive"
      });
    }
  }

  const toggleToDo = async (id: string) => {
    const todoToUpdate = toDos.find(todo => todo.id === id);
    if (!todoToUpdate) return;

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todos/edit/${id}`,
        {
          title: todoToUpdate.title,  // Make sure to include the title
          checked: !todoToUpdate.checked
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      setToDos(toDos.map(todo => 
        todo.id === id ? { ...todo, checked: response.data.checked } : todo
      ));
    } catch (error) {
      toast({
        title: "Erro",
        description: `Houve um erro ao atualizar a tarefa. ${error}`,
        variant: "destructive"
      });
    }
  }

  useEffect(() => {
    const fetchToDos = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todos`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
        setToDos(response.data.map((item: ToDo) => ({
          id: item.id,
          title: item.title,
          checked: item.checked
        })));
      } catch (error) {
        toast({
          title: "Erro",
          description: `Houve um erro, as tarefas não podem ser mostradas. ${error}`,
          variant: "destructive"
        });
      }
    };

    if (token) {
      fetchToDos();
    }
  }, [token]);

  return (
    <Card className="w-full h-full mx-auto p-4 rounded-lg shadow-sm">
        <CardTitle className="text-xl font-semibold mb-4">Minhas tarefas</CardTitle>
        <CardDescription className="mb-6">Organize suas tarefas diárias</CardDescription>

      <div className="flex gap-2 mb-6">
        <Input
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Adicionar uma nova tarefa..."
          onKeyDown={(e) => e.key === 'Enter' && addToDo()}
          className="flex-1"
        />
        <Button 
          size="icon" 
          onClick={addToDo}
        >
          <Plus className="h-4 w-4" color="black"/>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-3 mb-6">
            {toDos.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Nenhuma tarefa. Adicione sua primeira tarefa acima.
              </div>
            ) : (
              toDos.map((todo) => (
                <FormField
                  key={todo.id}
                  control={form.control}
                  name="items"
                  render={() => {
                    return (
                      <div className={`flex items-center p-3 rounded-lg border`}>
                        <FormItem className="flex flex-1 items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={todo.checked}
                              onCheckedChange={() => toggleToDo(todo.id)}
                              className={`h-5 w-5 ${todo.checked ? 'bg-[#ffffff00]' : 'border-white'}`}
                            />
                          </FormControl>
                          <label className={`text-sm ${todo.checked ? 'line-through text-gray-400' : 'text-white'}`}>
                            {todo.title}
                          </label>
                        </FormItem>
                        <Button
                          type="button"
                          onClick={() => removeToDo(todo.id)}
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  }}
                />
              ))
            )}
          </div>
        </form>
      </Form>
    </Card>
  )
}
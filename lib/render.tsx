import { z } from 'zod'
export const models = [{ name: 'gpt_retrieval', value: 'extra large' }]
import { AIState } from '@/lib/chat/actions'

const api_url = 'https://90f1-93-175-6-95.ngrok-free.app'
const backend_path = '/api/v1/registration/register_user'

export async function render<
  TS extends {
    [name: string]: z.Schema
  } = {},
  FS extends {
    [name: string]: z.Schema
  } = {}
>(options: {
  modelname: string
  message: string
  aiState: AIState
}): Promise<any> {
  ;('use server')
  let data = {
    user_id: options.aiState.chatId,
    message: options.message,
    model_type: options.modelname
  }

  let response = await fetch(
    api_url + backend_path + '?post=' + JSON.stringify(data),
    {
      method: 'POST'
    }
  )
  //.then(response => response.json())
  //.then(result => console.log(result))
  console.log(options.message)
  console.log(options.modelname)
  return JSON.parse(await response.text()).content
}

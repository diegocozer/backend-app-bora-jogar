/* eslint-disable prettier/prettier */
export function formatDateTimeToDDMMYYYY(dateTimeString: string): string {
  const [date, time] = dateTimeString.split(' ')
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year} ${time}`
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Meses em JavaScript são baseados em zero
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

export const padding = (a: number, b: number, c: number, d: number) => ({
  paddingTop: a,
  paddingRight: b ?? a,
  paddingBottom: c ?? a,
  paddingLeft: d ?? b ?? a,
})

export function formatDateToMySQL(date: any) {
  if (!date) return null
  if (date instanceof Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const [day, month, year] = date.split('/');

  const parsedDate = new Date(`${year}-${month}-${day}`)
  if (!isNaN(parsedDate.getTime())) {
    return formatDateToMySQL(parsedDate)
  }
  return null
}

export function getDayOfWeek(codigo) {
  // console.log(typeof codigo)
  const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  if (codigo >= 0 && codigo <= 6) {
    return diasDaSemana[codigo];
  } else {
    return 'Código inválido'; 
  }
}


export const calcularIdade = (dataNasc: string) => {
  const hoje = new Date();
  const dataNascimento = new Date(dataNasc);
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const diferencaMes = hoje.getMonth() - dataNascimento.getMonth();
  if (diferencaMes < 0 || (diferencaMes === 0 && hoje.getDate() < dataNascimento.getDate())) {
    idade--;
  }
  return idade;
};
  


export function calcularMedia(valores: number[]): number | string {
  if (valores.length !== 7) {
    return 'A lista deve conter exatamente 7 valores';
  }

  const soma = valores.reduce((acc, valor) => acc + valor, 0);

  const media = soma / valores.length;

  return media;
}
import { prisma } from "@/lib/prisma";
import PCutiPage from "@/components/Pdf/Pcuti";
import { formatDateShort } from "@/lib/sfBGS";

export default async function BaruCutiPage({
  params,
}: {
  params: { id: string };
}) {
  if(params.id.length<5){
    return "";
  }
  const dcuti = await prisma.cuti.findUnique({
    where: { id: params.id },
    include:{
      pegawai:true
    }
  });

  // console.log(dcuti);
  
  return <PCutiPage v={{
    ...dcuti,...JSON.parse(dcuti.tt),
    dateS:formatDateShort(dcuti?.tanggalMulai),
    dateE:formatDateShort(dcuti?.tanggalSelesai)
  }}/>;
}
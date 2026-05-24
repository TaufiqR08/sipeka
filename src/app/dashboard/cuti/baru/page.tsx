import { prisma } from "@/lib/prisma";
import Fcuti from "@/components/Form/Fcuti";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isKepala,isKabid } from "@/lib/sfBGS";

export default async function BaruCutiPage() {

  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const { role, pegawaiId,bidangId } = user; 
  

  const dtBidang = await prisma.bidang.findMany({
    where: {
      id: bidangId,
    },
    include: {
      dinas: {
        include: {
          pimpinan: true,
        },
      },
      pimpinan: true,
    },

    orderBy: {
      createdAt: "asc",
    },
  });

  const all = await prisma.pegawai.findMany({
    orderBy:{
      nip:"asc"
    }
  });
  const dtUser = all.filter(p => p.id === pegawaiId);
  const dtLuar = all.filter(p => p.nip.length === 1);

  console.log(dtBidang);
  
  const { pimpinan,dinas, jabatan}= dtBidang[0];
  
  const data={
    user:{
      jab:dtUser[0]?.jabatan,
      nm:dtUser[0]?.nama,
      nip:dtUser[0]?.nip,
    },bidang:{
      jab:jabatan  +" "+ dinas.nm,
      nm:pimpinan.nama,
      nip:pimpinan?.nip,
    },dinas:{
      jab:dinas.pimpinan?.jabatan +" "+ dinas.nm,
      nm:dinas.pimpinan?.nama,
      nip:dinas.pimpinan?.nip,
    },bupati:{
      jab:dtLuar[0]?.jabatan,
      nm:dtLuar[0]?.nama,
      nip:"",
    },wakil:{
      jab:dtLuar[1]?.jabatan,
      nm:dtLuar[1]?.nama,
      nip:"",
    },bkd:{
      jab:dtLuar[2]?.jabatan,
      nm:dtLuar[2]?.nama,
      nip:"",
    }
  };  
  // console.log(data);
  
  let dcuti = await prisma.cuti.findFirst({
      where: {
          pegawaiId: pegawaiId,
          status:{
            not: "DISETUJUI",
          },
      },
  });  
  
  return <Fcuti rawData={data} 
    dcuti={{...dcuti,...JSON.parse(dcuti?.tt || "{}")}}
  />;
}
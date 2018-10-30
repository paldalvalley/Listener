<h1>Server</h1>
18.10.30 수정

Database에 저장되어야 하는 정보들
*  User의 정보
*  1) Wallet 주소
*  2) Ether 주소
*  3) Name (ID)
*  4) 키
*  5) 몸무게
*  6) 나이
*  7) 성별 (boolean)

Server 역할

-> front-end 에서 end-point에 method 요청시 해당 작업 수행
   database 통해서 ipfs_hash값 받아와서 해당 data respond
   ipfs-api 이용할 것
   
-> listener 이용하여 contract에서 발생한 event listen and handle

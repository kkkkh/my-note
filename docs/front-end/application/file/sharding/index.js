export function asyncSharding(){
    // #region article-file-asyncSharding
    const ipt = document.getElementById("asyncInput")
    ipt.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            return
        }
        console.time()
        cutFile(file).then(res => {
          console.log("res", res)
          console.timeEnd()

        })
    }
    const CHUNK_SIZE = 10 * 1024 * 1024; // 每一片文件的大小 这里暂定 每片 10MB
    async function cutFile(file) {
        let res = [];
        let chunkCount = Math.ceil(file.size / CHUNK_SIZE); 
        const chunks = new Array(chunkCount).fill("").map((item,index) => createChunks(file,index,CHUNK_SIZE))
        return Promise.allSettled(chunks)
    }
    function createChunks (file, index, chunkSize) {
        return new Promise((resolve) => {
            const start = index * chunkSize;
            const end = start + chunkSize;
            // const spark = new SparkMD5()
            const fileReader = new FileReader();
            const blob = file.slice(start, end);
            fileReader.onload = e => {
                console.log("onload",index)
                // spark.append(e.target.result)
                console.log("spark.append",index)
                // const hash = spark.end()
                console.log(e.target.result)
                const hash = SparkMD5.ArrayBuffer.hash(e.target.result)
                console.log("spark.end",index)
                resolve({
                    start,
                    end,
                    blob,
                    hash,
                    index
                });
            }
            fileReader.readAsArrayBuffer(blob)
        });
    }
    // #endregion article-file-asyncSharding
}

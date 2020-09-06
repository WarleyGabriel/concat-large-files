# concat-large-files

[Video class about the project.](https://youtu.be/iT97rkTEvSo)

Run and combine the files:

```bash
npm start | tee ./result/log.log
```

Reading the first 100 lines of the file:

```bash
cat ./result/final.csv | head -100
```

Reading the latest 100 lines of the file:

```bash
cat ./result/final.csv | tail -100
```

Checking how many lines there is in a file:

```bash
cat ./result/final.csv | wc -l
```

Sum numbers with node:

```bash
node -p '2+3'
```

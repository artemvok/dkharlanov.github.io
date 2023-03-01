n = int(input('Введите количество элементов a для ввода: '))
for i in range(1,n+1):
    print("Введите элемент A",i,": ")
    a = int(input())
    if a == 10:
        countA = i
        break
print(countA)


const timeCard = document.querySelector('#timeCard');
const cartShoppingBtn = document.querySelector('#cartShoppingBtn');
const cBody = document.querySelector('#cBody');
const cModal = document.querySelector('#cModal');
const childrenModal = document.querySelector('#childrenModal');
const restaurantClosed = document.querySelector('#restaurantClosed');
const btnClose = document.querySelector('#btnClose');
const btnAddCart = [...document.querySelectorAll('.btnAddCart')];
const listProducts = document.querySelector('#listProducts');
const lengthCard = document.querySelector('#lengthCard');
const total = document.querySelector('#total');
const form = document.querySelector('#checkout');
const btnCheckout = document.querySelector('#checkout');
const address = document.querySelector('#address');
const alertTextArea = document.querySelector('#alertTextArea');

if (localStorage.getItem('db') === null) {
  localStorage.setItem('db', JSON.stringify([]));
};

// funcao controladora do card de horario e alert de restaurante fechado
const timeCardColor = () => {
  const currentTime = new Date();

  const currentHour = currentTime.getHours();
  const currentDay = currentTime.getDay();

  // if ((currentHour < 18 || currentHour > 21) || (currentDay === 1)) {
  //   timeCard.classList.remove('bg-c_green');
  //   timeCard.classList.add('bg-c_red');

  //   restaurantClosed.classList.remove('hidden');
  //   btnCheckout.classList.remove('bg-c_green', 'text-white', 'duration-200', 'hover:scale-110', 'hover:bg-green-700');
  //   btnCheckout.classList.add('bg-gray-300');
  //   btnCheckout.disabled = true;
  // };

};
timeCardColor();

// carrinho de compras
// obtem o array do localStorage
let dbString = localStorage.getItem('db');
let localStorageArr = JSON.parse(dbString);

// funcao que atualiza o localStorage
const updateLocalStorage = () => {
  localStorage.setItem('db', JSON.stringify(localStorageArr));
};

// funcao que adiciona os produtos no array
btnAddCart.forEach(item => {
  item.addEventListener('click', () => {

    // id do produto adicionado
    let idItem = item.parentNode.previousElementSibling.children[0].getAttribute('data-id');

    // verifica se o item ja existe no array (true/false)
    let objEnc = localStorageArr.some(prod => prod.id === idItem);

    if (objEnc) {
      // se o produto ja existir no array, soma 1 na quantidade do produto
      for (const prod of localStorageArr) {
        if (prod.id === idItem) {
          prod.qnt += 1;
          break;
        };
      };

    } else {
      // se o produto não existir no array, adiciona o objeto com as imformacoes ao array
      localStorageArr.push({
        id: item.parentNode.previousElementSibling.children[0].getAttribute('data-id'),
        product: item.parentNode.previousElementSibling.children[0].getAttribute('data-product'),
        price: Number(item.previousElementSibling.getAttribute('data-price')).toFixed(2),
        qnt: 1
      });

    };
    
    updateLocalStorage();
    renderQuantity();
    renderTotal();
  });
});

// controle do modal
const modal = () => {
  cBody.classList.add('overflow-y-hidden');
  cModal.classList.remove('hidden');
  cModal.classList.add('flex');

  // limpa a div de lista de produtos primeiro e depois chama a funcao de renderização
  if (localStorageArr.length === 0) {
    listProducts.innerHTML = "Carrinho vazio!";
  } else {
    listProducts.innerHTML = "";
  };

  renderProducts();
};
cartShoppingBtn.addEventListener('click', modal);

const closeModal = () => {
  cBody.classList.remove('overflow-y-hidden');
  cModal.classList.add('hidden');
  cModal.classList.remove('flex');

};
btnClose.addEventListener('click', closeModal);
cModal.addEventListener('click', (ev) => {
  if (ev.target !== cModal) {
    
  } else {
    closeModal();
  };
});

// funcao para renderizar os produtos no carrinho
const renderProducts = () => {

  localStorageArr.forEach(products => {
    const divCard = document.createElement('div');
    divCard.classList.add('rounded-md', 'p-1', 'leading-8', 'shadow-custonShadow', 'text-start');
    divCard.innerHTML = `
      <h3 class="text-lg font-semibold">${products.product}</h3>

      <div class="flex items-center justify-between">

        <span>( Quantidade: ${products.qnt} )</span>

        <button class="removeCart rounded-md bg-c_red p-1 text-sm font-semibold text-white hover:scale-110 hover:bg-red-800 duration-200" data-name="${products.id}">Remover</button>

      </div>

      <span class="font-bold">R$ ${(products.price).replace('.', ',')}</span>
    `;

    listProducts.appendChild(divCard);
  });
};

// remover item
// adiciona um ev  na lista de produtos
listProducts.addEventListener('click', (ev)=> {
  // se o item clicado tiver a classe 'removeCart' retorna true
  if (ev.target.classList.contains('removeCart')) {

    // referencia o valor do atributo 'data-name'
    const product = ev.target.getAttribute('data-name');

    localStorageArr.forEach(item => {
      // se o 'id' for igual ao 'data-name' e a quantidade diferente de 1
      if ((item.id === product) && (item.qnt !== 1)) {
        item.qnt--;

      // se o 'id' for igual ao 'data-name' e a quantidade igual a 1
      } else if ((item.id === product) && (item.qnt === 1)) {
        // retorna um array sem o elemento do 'data-name'
        const arrUpdated = localStorageArr.filter(prod => prod.id !== product);
        localStorageArr = arrUpdated;
      };

      renderQuantity();
      renderTotal();
      listProducts.innerHTML = "";
      renderProducts();
      
      // se o array estiver vazio
      if (localStorageArr.length === 0) {
        listProducts.innerHTML = "Carrinho vazio!";
        total.innerHTML = '';
      };

    });
  };

  updateLocalStorage();
});

// quantidade de itens no carrinho
const renderQuantity = () => {
  // quantidade de itens no carrinho
  let itensQuantity = 0;
  
  for (const prod of localStorageArr) {
    itensQuantity += prod.qnt;
  };
  
  lengthCard.innerHTML = `( ${itensQuantity} )`;
};

// total do carrinho
let cartValue = 0;
const renderTotal = () => {
  cartValue = 0;

  for (const prod of localStorageArr) {
    cartValue += prod.price * prod.qnt;
  };
  
  total.innerHTML = `Total: R$ ${cartValue.toFixed(2).replace('.', ',')}`;
};

renderQuantity();
renderTotal();

// pedido
const sendRequest = () => {
  let request = "";

  localStorageArr.forEach(item => {
    request += `${item.qnt}x - ${item.product} - R$ ${item.price.replace('.', ',')}%0A`;
  });

  let requestDescription = `Pedido%0A%0A${request}%0ATotal: R$ ${cartValue.toFixed(2).replace('.', ',')}%0AEndereço: ${address.value}`;

  return requestDescription;
};

// verifica se o endereco esta preenchido
address.addEventListener('input', (ev) => {
  let textAreaValue = ev.target.value;

  if (textAreaValue !== "") {
    address.classList.remove('border-red-500');
    alertTextArea.classList.remove('flex');
    alertTextArea.classList.add('hidden');
  };
  
});

btnCheckout.addEventListener('click', (ev) => {
  ev.preventDefault();

  if (localStorageArr.length !== 0) {

    if (address.value === "") {
      address.classList.add('border-red-500');
      alertTextArea.classList.remove('hidden');
      alertTextArea.classList.add('flex');
    } else {
      window.open(`https://wa.me/5585987692718?text=${sendRequest()}`, "_blank");
    };
  };

});

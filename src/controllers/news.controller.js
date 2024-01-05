import {
  createService,
  findAllService,
  countNews,
} from "../services/news.services.js";

const create = async (req, res) => {
  try {
    const { title, text, banner } = req.body;

    if (!title || !text || !banner) {
      res.status(400).send({ message: " Preencha todos os campos." });
    }

    await createService({
      title,
      text,
      banner,
      user: req.userId,
    });

    res.send(201);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const findAll = async (req, res) => {
  let { limit, offset } = req.query;

  limit = Number(limit);
  offset = Number(offset);

  if (!limit) {
    limit = 5;
  }

  if (!offset) {
    offset = 0;
  }

  const news = await findAllService(offset, limit);
  const total = await countNews();
  const currentUrl = req.baseUrl;
  console.log(currentUrl);

  const next = offset + limit;
  const nextUrl =
    next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

  const prev = offset - limit < 0 ? null : offset + limit;
  const prevUrl =
    prev != null ? `${currentUrl}?limit=${limit}&offset=${prev}` : null;

  if (news.length === 0) {
    return res.status(400).send({ message: "Não há Notícias registradas!" });
  }

  res.send({
    nextUrl,
    prevUrl,
    limit,
    offset,
    total,
    result: news.map((Item) => ({
      id: Item._id,
      title: Item.title,
      text: Item.text,
      banner: Item.banner,
      likes: Item.likes,
      comments: Item.comments,
      name: Item.user.name,
      esername: Item.user.username,
      userAvatar: Item.user.avatar
    })),
  });
};

export { create, findAll };

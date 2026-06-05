const { prisma } = require("../config/db");

exports.getPages = async (req, res) => {
  try {
    const list = await prisma.cmsPage.findMany();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPage = async (req, res) => {
  try {
    const page = await prisma.cmsPage.findUnique({
      where: { id: req.params.id },
    });

    if (!page) return res.status(404).json({ error: "CMS page not found" });

    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const { id, title, content } = req.body;

    if (!id || !title || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updated = await prisma.cmsPage.update({
      where: { id },
      data: { title, content },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

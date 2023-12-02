import React from 'react';
import { motion } from 'framer-motion';

export default function Blog() {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="container text-white mx-auto p-8">
      <motion.h1
        className="text-4xl font-bold mb-6"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        Sztuczny Blog
      </motion.h1>

      <motion.div
        className="mb-8"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        <motion.img
          src="https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Kitten"
          className="w-full h-64 object-cover mb-4 rounded-lg"
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        />
      </motion.div>

      <motion.div
        className="mb-8"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">Pierwszy Paragraf</h2>
        <p className="text-white">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.
          Suspendisse potenti. Integer euismod mauris nec elit cursus euismod. Nam ut justo
          eu tellus blandit luctus sit amet in risus. Vivamus eu odio in metus auctor
          ullamcorper.
        </p>
      </motion.div>

      <motion.div
        className="mb-8"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <h2 className="text-2xl font-bold mb-4">Drugi Paragraf</h2>
        <p className="text-white">
          Phasellus nec leo eu est ullamcorper dapibus. Etiam et odio eu quam laoreet
          efficitur. Sed gravida tellus quis orci facilisis, vitae aliquam nulla sagittis.
        </p>
      </motion.div>

      <motion.div
        className="mb-8"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">Tabela</h2>
        <table className="table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Nagłówek 1</th>
              <th className="border px-4 py-2">Nagłówek 2</th>
              <th className="border px-4 py-2">Nagłówek 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Dane 1</td>
              <td className="border px-4 py-2">Dane 2</td>
              <td className="border px-4 py-2">Dane 3</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Dane 4</td>
              <td className="border px-4 py-2">Dane 5</td>
              <td className="border px-4 py-2">Dane 6</td>
            </tr>
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

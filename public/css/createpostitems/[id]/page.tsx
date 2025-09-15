'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// import AOS
import AOS from 'aos';

export default function EditPostItem({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();

  const [text, setText] = useState<any | {}>({});
  const getSinglePostData = () => {
    fetch(`/api/postitems/${id}`)
      .then(res => {
        if (res.status === 404) {
          router.push('/not-found');
        }
        return res.json();
      })
      .then(data => setText(data))
      .catch(e => console.log(e.message));
  };

  useEffect(() => {
    getSinglePostData();
  }, []);

  const handleTextChange = (e: Event | any) => {
    const { name, value } = e.target;
    setText({ ...text, [name]: value, validate: '' });
  };

  const handleFormSubmit = async (e: Event | any) => {
    e.preventDefault();
    // simple form validation
    if (
      text.title === '' ||
      text.img === '' ||
      text.category === '' ||
      text.brief === ''
    ) {
      setText({ ...text, validate: 'incomplete' });
      return;
    }

    // POST request sent
    try {
      const response = await fetch(`/api/postitems/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(text),
      });

      setText({ ...text, validate: 'loading' });

      const result = response.status;
      if (result === 200) {
        setText({ ...text, validate: 'success' });
        console.log('Success:', result);
      }
    } catch (error) {
      setText({ ...text, validate: 'error' });
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: false,
      mirror: false,
    });
  }, []);

  return (
    <main id="main">
      <section className="create-post-content">
        <div className="container" data-aos="fade-up">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-10">
              <div className="row d-flex justify-content-center mt-5">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-12 text-center mb-5">
                      <h1 className="page-title">Edit Post</h1>
                    </div>
                  </div>
                  <form onSubmit={handleFormSubmit}>
                    <div className="row">
                      <div className="col-lg-6 mb-3">
                        <label>Title</label>
                        <input
                          type="text"
                          name="title"
                          value={text.title}
                          onChange={handleTextChange}
                          className="form-control"
                          placeholder="Enter Title"
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label>Image URL</label>
                        <input
                          type="text"
                          name="img"
                          value={text.img}
                          onChange={handleTextChange}
                          className="form-control"
                          placeholder="Enter Image URL"
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label>Category</label>
                        <input
                          type="text"
                          name="category"
                          value={text.category}
                          onChange={handleTextChange}
                          className="form-control"
                          placeholder="Enter Post Category"
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label>Author</label>
                        <input
                          type="text"
                          name="author"
                          value={text.author}
                          onChange={handleTextChange}
                          className="form-control"
                          placeholder="Enter Author Name"
                        />
                      </div>
                      <div className="col-12 mb-3">
                        <label>Brief</label>
                        <textarea
                          className="form-control"
                          name="brief"
                          value={text.brief}
                          onChange={handleTextChange}
                          placeholder="Enter Post Brief"
                          cols={30}
                          rows={10}
                        ></textarea>
                      </div>
                      <div className="mb-3">
                        {text.validate === 'loading' && (
                          <div className="loading">Sending Post</div>
                        )}
                        {text.validate === 'incomplete' && (
                          <div className="error-message">
                            Please fill in all above details.
                          </div>
                        )}
                        {text.validate === 'success' && (
                          <div className="sent-message">
                            Your news was posted successfull. Thank you!
                          </div>
                        )}
                        {text.validate === 'error' && (
                          <div className="error-message">Server Error</div>
                        )}
                      </div>
                      <div className="col-12 d-flex justify-content-center">
                        <input
                          type="submit"
                          className="btn btn-primary"
                          value="Update Item"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
